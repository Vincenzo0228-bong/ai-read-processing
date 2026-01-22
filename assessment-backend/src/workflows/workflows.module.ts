import { Module, forwardRef } from '@nestjs/common';
import { WorkflowGatewayModule } from './workflow-gateway.module';
import { WorkflowGateway } from './workflow.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflow } from './workflow.entity';
import { WorkflowStep } from './workflow-step.entity';
import { WorkflowService } from './workflow.service';
import { BullModule } from '@nestjs/bull';
import { WorkflowProcessor } from './workflow.processor';
import { AIClient } from '../ai/ai.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workflow, WorkflowStep]),
    BullModule.registerQueue({
      name: 'workflow',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    forwardRef(() => WorkflowGatewayModule),
  ],
  providers: [WorkflowService, WorkflowProcessor, AIClient, WorkflowGateway],
  exports: [WorkflowService, WorkflowGateway],
})
export class WorkflowsModule {}
