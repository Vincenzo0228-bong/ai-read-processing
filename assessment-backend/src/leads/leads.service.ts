import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { WorkflowService } from '../workflows/workflow.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepo: Repository<Lead>,
    private readonly workflowService: WorkflowService,
    @InjectQueue('workflow')
    private readonly workflowQueue: Queue,
  ) {}

  async createLead(userId: string, name: string, contactChannel: string, message: string) {
    const lead = this.leadsRepo.create({
      userId,
      name,
      contactChannel,
      message,
    });

    const savedLead = await this.leadsRepo.save(lead);

    // Create workflow for this lead
    const workflow = await this.workflowService.createWorkflow(
      userId,
      savedLead.id,
      message,
    );

    try {
      console.log(`[LeadsService] Adding workflow job for workflowId: ${workflow.id}`);
      await this.workflowQueue.add('run', {
        workflowId: workflow.id,
      });
      console.log(`[LeadsService] Successfully enqueued workflow job for workflowId: ${workflow.id}`);
    } catch (err) {
      console.error(`[LeadsService] Failed to enqueue workflow job for workflowId: ${workflow.id}`, err);
    }
    return savedLead;
  }

  async findAllForUser(userId: string) {
    // Join leads with their workflow and return workflow status with each lead
    const leads = await this.leadsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Get all workflows for these leads in one query
    const leadIds = leads.map((l) => l.id);
    const workflows = await this.workflowService.getWorkflowsForLeads(leadIds);
    const workflowMap = new Map(workflows.map(wf => [wf.leadId, wf]));

    // Attach workflow status to each lead
    return leads.map(lead => ({
      ...lead,
      status: workflowMap.get(lead.id)?.status || 'pending',
    }));
  }
  async findOneForUser(userId: string, leadId: string) {
    // Find the lead and ensure it belongs to the user
    const lead = await this.leadsRepo.findOne({ where: { id: leadId, userId } });
    if (!lead) return null;
    // Get workflow and steps for this lead
    const workflows = await this.workflowService.getWorkflowsForLeads([leadId]);
    const workflow = workflows[0];
    let steps: any[] = [];
    let final_output: any = null;
    if (workflow) {
      // Get steps for this workflow
      if (this.workflowService['stepRepo']) {
        steps = await this.workflowService['stepRepo'].find({ where: { workflowId: workflow.id }, order: { createdAt: 'ASC' } });
      }
      // Output final_output as a sorted object: message, intent, extraction, routing (if present)
      if (workflow.context) {
        const ctx = workflow.context;
        final_output = {};
        if ('message' in ctx) final_output['message'] = ctx['message'];
        if ('intent' in ctx) final_output['intent'] = ctx['intent'];
        if ('extraction' in ctx) final_output['extraction'] = ctx['extraction'];
        if ('routing' in ctx) final_output['routing'] = ctx['routing'];
      } else {
        final_output = workflow.context;
      }
    }
    return {
      ...lead,
      workflow,
      steps,
      final_output,
    };
  }
}
