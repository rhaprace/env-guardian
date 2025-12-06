/**
 * @rhap/env-guardian
 * Zero-dependency schema-based environment variable validator
 */

export { ENV } from './schema';
export { defineEnv, EnvValidationError } from './validator';
export type { SchemaDefinition, InferEnvType } from './schema';
