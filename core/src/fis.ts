import { z } from 'zod';

export const SuccessCriterionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  metricType: z.enum(['latency', 'error_rate', 'availability', 'ticket_count', 'custom']),
  sensorType: z.enum(['code', 'metrics', 'tickets', 'logs']),
  operator: z.enum(['eq', 'lt', 'gt', 'lte', 'gte', 'neq']).default('eq'),
  unit: z.string().optional(),
});

export const FISSchema = z.object({
  id: z.string().uuid(),
  owner_email: z.string().email(),
  statement_nl: z.string().min(10, "Intent statement must be at least 10 characters"),
  scope: z.object({
    type: z.enum(['repo', 'service', 'team', 'org']),
    identifier: z.string(),
  }),
  criteria: z.array(SuccessCriterionSchema).min(1, "At least one success criterion is required"),
  thresholds: z.record(z.union([z.number().nonnegative(), z.string(), z.boolean()])),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']),
  timeHorizon: z.enum(['continuous', 'deadline']),
  deadline: z.date().optional(),
  status: z.enum(['active', 'archived', 'pending', 'needs_attention']).default('active'),
  created_at: z.date().default(() => new Date()),
});

export type FIS = z.infer<typeof FISSchema>;
export type SuccessCriterion = z.infer<typeof SuccessCriterionSchema>;
