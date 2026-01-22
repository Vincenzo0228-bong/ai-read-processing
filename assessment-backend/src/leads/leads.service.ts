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

    await this.workflowQueue.add('run', {
      workflowId: workflow.id,
    });
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
}
