import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WorkflowService } from './workflow.service';
import { Workflow } from './workflow.entity';
import { WorkflowStep } from './workflow-step.entity';
import { AIClient } from '../ai/ai.client';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let workflowRepo: Repository<Workflow>;
  let stepRepo: Repository<WorkflowStep>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkflowService,
        {
          provide: getRepositoryToken(Workflow),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(WorkflowStep),
          useClass: Repository,
        },
        {
          provide: AIClient,
          useValue: {
            complete: jest.fn().mockResolvedValue(
              JSON.stringify({
                category: 'sales_new',
                confidence: 0.9,
                rationale: 'Pricing request',
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get(WorkflowService);
    workflowRepo = module.get(getRepositoryToken(Workflow));
    stepRepo = module.get(getRepositoryToken(WorkflowStep));
  });

  it('runs workflow without crashing', async () => {
    jest.spyOn(workflowRepo, 'findOne').mockResolvedValue({
      id: 'wf-1',
      status: 'pending',
      context: { message: 'Hello, pricing please' },
    } as any);

    jest.spyOn(stepRepo, 'find').mockResolvedValue([]);
    jest.spyOn(stepRepo, 'update').mockResolvedValue({} as any);
    jest.spyOn(workflowRepo, 'update').mockResolvedValue({} as any);

    await expect(service.runWorkflow('wf-1')).resolves.not.toThrow();
  });
});
