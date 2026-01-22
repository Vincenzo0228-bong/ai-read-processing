export const WORKFLOW_STEPS = [
  'intent_classification',
  'data_extraction',
  'routing_decision',
] as const;

export type WorkflowStepType = typeof WORKFLOW_STEPS[number];
