import { OpenAPIRegistry, OpenApiGeneratorV31, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * Single registry shared by all modules. Each module registers its paths
 * from the same Zod schemas it validates with, so docs cannot drift from behaviour.
 */
export const registry = new OpenAPIRegistry();

export const errorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({
    success: z.literal(false),
    error: z.object({
      code: z.string().openapi({ example: 'VALIDATION_ERROR' }),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  }),
);

/** Wraps a data schema in the standard success envelope. */
export function successResponse<T extends z.ZodType>(data: T) {
  return z.object({ success: z.literal(true), data });
}

export function generateOpenApiDocument() {
  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'MyFinance API',
      version: '1.0.0',
      description: 'Personal monthly finance management POC. All amounts are integer paise (₹1 = 100 paise).',
    },
    servers: [{ url: '/api/v1' }],
  });
}
