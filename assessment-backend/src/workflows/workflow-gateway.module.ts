import { Module, forwardRef } from '@nestjs/common';
import { WorkflowsModule } from '../workflows/workflows.module';
import { WorkflowGateway } from './workflow.gateway';

@Module({
  imports: [forwardRef(() => WorkflowsModule)],
  providers: [WorkflowGateway],
  exports: [WorkflowGateway],
})
export class WorkflowGatewayModule {}
