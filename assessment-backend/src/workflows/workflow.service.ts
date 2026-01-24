import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Workflow } from './workflow.entity';
import { WorkflowStep } from './workflow-step.entity';
import { WORKFLOW_STEPS, WorkflowStepType } from './workflow.constants';

import { AIClient } from '../ai/ai.client';
import Redis from 'ioredis';
// import { WorkflowGateway } from './workflow.gateway';
import { intentPrompt } from '../ai/prompts/intent.prompt';
import { extractionPrompt } from '../ai/prompts/extraction.prompt';
import { routingPrompt } from '../ai/prompts/routing.prompt';

import { IntentSchema } from '../ai/schemas/intent.schema';
import { ExtractionSchema } from '../ai/schemas/extraction.schema';
import { RoutingSchema } from '../ai/schemas/routing.schema';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepo: Repository<Workflow>,

    @InjectRepository(WorkflowStep)
    private readonly stepRepo: Repository<WorkflowStep>,

    private readonly ai: AIClient,
    // Remove direct gateway injection for worker-safe eventing
  ) {}

  // Get all workflows for a list of leadIds
  async getWorkflowsForLeads(leadIds: string[]) {
    if (!leadIds.length) return [];
    return this.workflowRepo.find({
      where: leadIds.map((id) => ({ leadId: id })),
    });
  }

  /* ────────────────────────────────────────────── */
  /* Workflow lifecycle                             */
  /* ────────────────────────────────────────────── */

  async createWorkflow(userId: string, leadId: string, message: string) {
    const workflow = await this.workflowRepo.save(
      this.workflowRepo.create({
        userId,
        leadId,
        status: 'pending',
        context: { message },
      }),
    );

    for (const step of WORKFLOW_STEPS) {
      await this.stepRepo.save(
        this.stepRepo.create({
          workflowId: workflow.id,
          stepType: step,
          status: 'not_started',
        }),
      );
    }

    return workflow;
  }

  async runWorkflow(workflowId: string): Promise<void> {
    this.logger.log(`[runWorkflow] Starting workflow: ${workflowId}`);
    const workflow = await this.workflowRepo.findOne({
      where: { id: workflowId },
    });

    if (!workflow) {
      this.logger.error(`[runWorkflow] Workflow ${workflowId} not found`);
      return;
    }

    await this.workflowRepo.update(workflow.id, {
      status: 'processing',
    });
    this.logger.log(`[runWorkflow] Workflow ${workflowId} set to processing`);
    try {
      // Publish status update to Redis Pub/Sub
      await this.publishStatus(workflow.userId, workflow.leadId, 'processing');
      this.logger.log('emitWorkflowStatusUpdate succeeded');
    } catch (err) {
      this.logger.error('emitWorkflowStatusUpdate failed', err);
    }
    console.log('ok after emit');
    const steps = await this.stepRepo.find({
      where: { workflowId },
      order: { createdAt: 'ASC' },
    });

    for (const step of steps) {
      this.logger.log(`[runWorkflow] Executing step: ${step.stepType} for workflow: ${workflowId}`);
      try {
        await this.runStep(workflow, step);
        this.logger.log(`[runWorkflow] Step ${step.stepType} completed for workflow: ${workflowId}`);
      } catch (err) {
        this.logger.error(`[runWorkflow] Step ${step.stepType} failed for workflow: ${workflowId} with error: ${err && err.message ? err.message : err}`);
        await this.failStep(step, err);
        await this.failWorkflow(workflow, err);
        return;
      }
    }

    await this.workflowRepo.update(workflowId, {
      status: 'completed',
    });
    this.logger.log(`[runWorkflow] Workflow ${workflowId} completed`);
  }

  /* ────────────────────────────────────────────── */
  /* Step dispatcher                                */
  /* ────────────────────────────────────────────── */

  private async runStep(workflow: Workflow, step: WorkflowStep): Promise<void> {
    this.logger.log(`[runStep] Setting step ${step.stepType} to processing for workflow: ${workflow.id}`);
    await this.stepRepo.update(step.id, {
      status: 'processing',
    });

    switch (step.stepType as WorkflowStepType) {
      case 'intent_classification':
        this.logger.log(`[runStep] Running intent classification step for workflow: ${workflow.id}`);
        return this.runIntentStep(workflow, step);

      case 'data_extraction':
        this.logger.log(`[runStep] Running data extraction step for workflow: ${workflow.id}`);
        return this.runExtractionStep(workflow, step);

      case 'routing_decision':
        this.logger.log(`[runStep] Running routing decision step for workflow: ${workflow.id}`);
        return this.runRoutingStep(workflow, step);

      default:
        this.logger.error(`[runStep] Unknown workflow step: ${step.stepType} for workflow: ${workflow.id}`);
        throw new Error(`Unknown workflow step: ${step.stepType}`);
    }
  }

  /* ────────────────────────────────────────────── */
  /* Step 1 — Intent classification                 */
  /* ────────────────────────────────────────────── */

  private async runIntentStep(workflow: Workflow, step: WorkflowStep) {
    try {
      this.logger.log(`[runIntentStep] ENTER function for workflow: ${workflow.id}`);
      this.logger.log(`[runIntentStep] Starting for workflow: ${workflow.id}`);
      const message: string = String(workflow.context.message ?? '');
      this.logger.log(`[runIntentStep] Calling AI for intent classification...`);
      const raw = await this.ai.complete(intentPrompt(message));
      this.logger.log(`[runIntentStep] AI response: ${raw}`);
      const parsed = IntentSchema.parse(JSON.parse(raw));
      this.logger.log(`[runIntentStep] Parsed intent: ${JSON.stringify(parsed)}`);
      await this.stepRepo.update(step.id, {
        status: 'completed',
        output: parsed as any,
      });
      await this.workflowRepo.update(workflow.id, {
        context: {
          ...workflow.context,
          intent: parsed as any,
        },
      });
      // Reload workflow entity to ensure updated context for next step
      const updated = await this.workflowRepo.findOne({ where: { id: workflow.id } });
      if (updated) {
        Object.assign(workflow, updated);
      }
      await this.publishStatus(workflow.userId, workflow.leadId, 'processing');
      this.logger.log(`[runIntentStep] Completed for workflow: ${workflow.id}`);
    } catch (err) {
      this.logger.error(`[runIntentStep] Error for workflow: ${workflow.id}: ${err && err.message ? err.message : err}`);
      throw err;
    }
  }

  /* ────────────────────────────────────────────── */
  /* Step 2 — Structured data extraction             */
  /* ────────────────────────────────────────────── */

  private async runExtractionStep(workflow: Workflow, step: WorkflowStep) {
    try {
      this.logger.log(`[runExtractionStep] Starting for workflow: ${workflow.id}`);
      if (!workflow.context.intent) {
        throw new Error('Intent missing from workflow context');
      }
      const message: string = String(workflow.context.message ?? '');
      const category: string = String((workflow.context.intent && workflow.context.intent.category) ?? '');
      this.logger.log(`[runExtractionStep] Calling AI for data extraction...`);
      const raw = await this.ai.complete(extractionPrompt(message, category));
      this.logger.log(`[runExtractionStep] AI response: ${raw}`);
      const parsed = ExtractionSchema.parse(JSON.parse(raw));
      this.logger.log(`[runExtractionStep] Parsed extraction: ${JSON.stringify(parsed)}`);
      await this.stepRepo.update(step.id, {
        status: 'completed',
        output: parsed as any,
      });
      await this.workflowRepo.update(workflow.id, {
        context: {
          ...workflow.context,
          extraction: parsed as any,
        },
      });
      // Reload workflow entity to ensure updated context for next step
      const updated = await this.workflowRepo.findOne({ where: { id: workflow.id } });
      if (updated) {
        Object.assign(workflow, updated);
      }
      await this.publishStatus(workflow.userId, workflow.leadId, 'processing');
      this.logger.log(`[runExtractionStep] Completed for workflow: ${workflow.id}`);
    } catch (err) {
      this.logger.error(`[runExtractionStep] Error for workflow: ${workflow.id}: ${err && err.message ? err.message : err}`);
      throw err;
    }
  }

  /* ────────────────────────────────────────────── */
  /* Step 3 — Routing decision (hybrid)              */
  /* ────────────────────────────────────────────── */

  private async runRoutingStep(workflow: Workflow, step: WorkflowStep) {
    try {
      this.logger.log(`[runRoutingStep] Starting for workflow: ${workflow.id}`);
      if (!workflow.context.intent || !workflow.context.extraction) {
        throw new Error('Missing context for routing decision');
      }
      this.logger.log(`[runRoutingStep] Calling AI for routing decision...`);
      const raw = await this.ai.complete(routingPrompt(workflow.context));
      this.logger.log(`[runRoutingStep] AI response: ${raw}`);
      const parsed = RoutingSchema.parse(JSON.parse(raw));
      this.logger.log(`[runRoutingStep] Parsed routing: ${JSON.stringify(parsed)}`);
      await this.stepRepo.update(step.id, {
        status: 'completed',
        output: parsed as any,
      });
      await this.workflowRepo.update(workflow.id, {
        status: 'completed',
        context: {
          ...workflow.context,
          routing: parsed as any,
        },
      });
      await this.publishStatus(workflow.userId, workflow.leadId, 'completed');
      this.logger.log(`[runRoutingStep] Completed for workflow: ${workflow.id}`);
    } catch (err) {
      this.logger.error(`[runRoutingStep] Error for workflow: ${workflow.id}: ${err && err.message ? err.message : err}`);
      throw err;
    }
  }

  /* ────────────────────────────────────────────── */
  /* Failure handling                               */
  /* ────────────────────────────────────────────── */

  private async failStep(step: WorkflowStep, err: any) {
    await this.stepRepo.update(step.id, {
      status: 'failed',
      error:
        typeof err === 'object' && err && 'message' in err
          ? String((err as any).message)
          : 'Unknown error',
    });
    // No direct emission here; handled at workflow level
  }
  private async failWorkflow(workflow: Workflow, err: any) {
    await this.workflowRepo.update(workflow.id, {
      status: 'failed',
    });
    await this.publishStatus(workflow.userId, workflow.leadId, 'failed');
    this.logger.error(
      `Workflow ${workflow.id} failed`,
      typeof err === 'object' && err && 'stack' in err
        ? String((err as any).stack)
        : typeof err === 'object' && err && 'message' in err
          ? String((err as any).message)
          : String(err),
    );
  }
  private redisPub: Redis | null = null;
  private getRedisPub(): Redis {
    if (!this.redisPub) {
      this.redisPub = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      });
    }
    return this.redisPub;
  }
  // Redis publisher for workflow status
  private async publishStatus(userId: string, leadId: string, status: string) {
    try {
      await this.getRedisPub().publish('workflow-status', JSON.stringify({ userId, leadId, status }));
    } catch (err) {
      this.logger.error(`[publishStatus] Failed to publish status: ${err && err.message ? err.message : err}`);
    }
  }
}
