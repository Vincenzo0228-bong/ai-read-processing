import { z } from 'zod';

export const CoreFields = {
  customer_name: z.string().optional(),
  contact_channel: z.enum(['whatsapp', 'webchat', 'email', 'other']),
  service_interest: z.string().optional(),
  location: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high']),
  timeline: z.enum(['now', '<1w', '1-4w', '>1m', 'unknown']),
  budget_range: z.enum([
    '<500',
    '500-2000',
    '2000-10000',
    '>10000',
    'unknown',
  ]),
  language: z.string().optional(),
  confidence: z.number().min(0).max(1),
};

export const ExtractionSchema = z.object({
  extracted_fields: z.object(CoreFields).passthrough(),
  confidence: z.number().min(0).max(1),
});
