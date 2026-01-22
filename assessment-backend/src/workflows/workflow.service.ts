import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Workflow } from './workflow.entity';
import { WorkflowStep } from './workflow-step.entity';
import { WORKFLOW_STEPS, WorkflowStepType } from './workflow.constants';

import { AIClient } from '../ai/ai.client';
import { WorkflowGateway } from './workflow.gateway';
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
    @Inject(WorkflowGateway)
    private readonly workflowGateway: WorkflowGateway,
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
    const workflow = await this.workflowRepo.findOne({
      where: { id: workflowId },
    });

    if (!workflow) {
      this.logger.error(`Workflow ${workflowId} not found`);
      return;
    }

    await this.workflowRepo.update(workflow.id, {
      status: 'processing',
    });
    this.workflowGateway.emitWorkflowStatusUpdate(
      workflow.userId,
      workflow.leadId,
      'processing',
    );

    const steps = await this.stepRepo.find({
      where: { workflowId },
      order: { createdAt: 'ASC' },
    });

    for (const step of steps) {
      try {
        await this.runStep(workflow, step);
      } catch (err) {
        await this.failStep(step, err);
        await this.failWorkflow(workflow, err);
        return;
      }
    }

    await this.workflowRepo.update(workflowId, {
      status: 'completed',
    });
  }

  /* ────────────────────────────────────────────── */
  /* Step dispatcher                                */
  /* ────────────────────────────────────────────── */

  private async runStep(workflow: Workflow, step: WorkflowStep): Promise<void> {
    await this.stepRepo.update(step.id, {
      status: 'processing',
    });

    switch (step.stepType as WorkflowStepType) {
      case 'intent_classification':
        return this.runIntentStep(workflow, step);

      case 'data_extraction':
        return this.runExtractionStep(workflow, step);

      case 'routing_decision':
        return this.runRoutingStep(workflow, step);

      default:
        throw new Error(`Unknown workflow step: ${step.stepType}`);
    }
  }

  /* ────────────────────────────────────────────── */
  /* Step 1 — Intent classification                 */
  /* ────────────────────────────────────────────── */

  private async runIntentStep(workflow: Workflow, step: WorkflowStep) {
    const message: string = String(workflow.context.message ?? '');
    const raw = await this.ai.complete(intentPrompt(message));

    const parsed = IntentSchema.parse(JSON.parse(raw));

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
    this.workflowGateway.emitWorkflowStatusUpdate(
      workflow.userId,
      workflow.leadId,
      'processing',
    );
  }

  /* ────────────────────────────────────────────── */
  /* Step 2 — Structured data extraction             */
  /* ────────────────────────────────────────────── */

  private async runExtractionStep(workflow: Workflow, step: WorkflowStep) {
    if (!workflow.context.intent) {
      throw new Error('Intent missing from workflow context');
    }

    const message: string = String(workflow.context.message ?? '');
    const category: string = String((workflow.context.intent && workflow.context.intent.category) ?? '');
    const raw = await this.ai.complete(
      extractionPrompt(message, category)
    );

    const parsed = ExtractionSchema.parse(JSON.parse(raw));

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
    this.workflowGateway.emitWorkflowStatusUpdate(
      workflow.userId,
      workflow.leadId,
      'processing',
    );
  }

  /* ────────────────────────────────────────────── */
  /* Step 3 — Routing decision (hybrid)              */
  /* ────────────────────────────────────────────── */

  private async runRoutingStep(workflow: Workflow, step: WorkflowStep) {
    if (!workflow.context.intent || !workflow.context.extraction) {
      throw new Error('Missing context for routing decision');
    }

    const raw = await this.ai.complete(routingPrompt(workflow.context));

    const parsed = RoutingSchema.parse(JSON.parse(raw));

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
    this.workflowGateway.emitWorkflowStatusUpdate(
      workflow.userId,
      workflow.leadId,
      'completed',
    );
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
    this.workflowGateway.emitWorkflowStatusUpdate(
      workflow.userId,
      workflow.leadId,
      'failed',
    );

      this.logger.error(
        `Workflow ${workflow.id} failed`,
        typeof err === 'object' && err && 'stack' in err
          ? String((err as any).stack)
          : typeof err === 'object' && err && 'message' in err
          ? String((err as any).message)
          : String(err),
      );
  }
}
