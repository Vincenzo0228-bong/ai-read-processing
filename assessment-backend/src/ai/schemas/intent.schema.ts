import { z } from 'zod';

export const IntentSchema = z.object({
  category: z.enum([
    'sales_new',
    'sales_existing',
    'support',
    'spam',
    'unknown',
  ]),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
});

export type IntentResult = z.infer<typeof IntentSchema>;
