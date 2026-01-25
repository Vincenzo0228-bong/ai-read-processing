import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { WorkflowService } from './workflow.service';

@Processor('workflow')
export class WorkflowProcessor {
  constructor(private readonly workflowService: WorkflowService) {
    console.log('[WorkflowProcessor] Worker initialized.');
    console.log(`[WorkflowProcessor] Using Redis host: ${process.env.REDIS_HOST}, port: ${process.env.REDIS_PORT}`);
  }

  @Process('run')
  async handleWorkflow(job: Job<{ workflowId: string }>) {
    console.log(`[WorkflowProcessor] Picked up job for workflowId: ${job.data.workflowId}`);
    await this.workflowService.runWorkflow(job.data.workflowId);
  }
}
