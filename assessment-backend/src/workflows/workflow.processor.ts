import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { WorkflowService } from './workflow.service';

@Processor('workflow')
export class WorkflowProcessor {
  constructor(
    private readonly workflowService: WorkflowService,
  ) {}

  @Process()
  async handleWorkflow(job: Job<{ workflowId: string }>) {
    await this.workflowService.runWorkflow(job.data.workflowId);
  }
}
