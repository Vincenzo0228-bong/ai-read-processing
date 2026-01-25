import { z } from 'zod';

export const RoutingSchema = z.object({
  queue: z.enum(['sales', 'support', 'ignore', 'needs_clarification']),
  priority: z.enum(['p0', 'p1', 'p2']),
  sla_minutes: z.number().int(),
  recommended_next_action: z.string(),
  required_followups: z.array(z.string()).optional(),
  explanation: z.string(),
});
