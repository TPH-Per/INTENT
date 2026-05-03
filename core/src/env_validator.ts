import { z } from 'zod';

const EnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(10, 'ANTHROPIC_API_KEY is required'),
  POSTGRES_URL: z.string().url('Invalid POSTGRES_URL'),
  REDIS_URL: z.string().min(5, 'REDIS_URL is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
});

export function validateEnv() {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Missing required environment variables:');
    result.error.errors.forEach(e => console.error(`  ${e.path}: ${e.message}`));
    process.exit(1);
  }
  return result.data;
}
