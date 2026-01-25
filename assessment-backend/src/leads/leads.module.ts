import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { WorkflowsModule } from '../workflows/workflows.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]),
    WorkflowsModule,
    BullModule.registerQueue({
      name: 'workflow',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
  ],
  providers: [LeadsService],
  controllers: [LeadsController],
})
export class LeadsModule {}
