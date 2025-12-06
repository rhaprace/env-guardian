import {
  Schema,
  SchemaDefinition,
  InferEnvType,
  SchemaBuilder,
  buildSchema,
} from './schema';

export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}
function getEnvSource(): Record<string, string | undefined> {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env;
  }
  
  throw new EnvValidationError(
    'No environment variable source found. Expected process.env or import.meta.env'
  );
}
function parseValue(
  key: string,
  value: string | undefined,
  schema: Schema
): any {
  if (value === undefined || value === '') {
    if (schema.hasDefault) {
      return schema.defaultValue;
    }
    if (schema.optional) {
      return undefined;
    }
    throw new EnvValidationError(
      `Missing required environment variable: ${key}`
    );
  }
  switch (schema.type) {
    case 'string':
      return value;

    case 'number': {
      const parsed = Number(value);
      if (isNaN(parsed)) {
        throw new EnvValidationError(
          `Invalid number for ${key}: expected number, got "${value}"`
        );
      }
      return parsed;
    }

    case 'boolean': {
      const lower = value.toLowerCase();
      if (lower === 'true' || lower === '1') {
        return true;
      }
      if (lower === 'false' || lower === '0' || lower === '') {
        return false;
      }
      throw new EnvValidationError(
        `Invalid boolean for ${key}: expected "true", "false", "1", or "0", got "${value}"`
      );
    }

    default:
      throw new EnvValidationError(
        `Unknown schema type for ${key}: ${(schema as any).type}`
      );
  }
}
function validateSchemaDefaults(schemaDefinition: SchemaDefinition): void {
  for (const [key, schema] of Object.entries(schemaDefinition)) {
    if (schema.hasDefault && schema.defaultValue !== undefined) {
      const typeofDefault = typeof schema.defaultValue;
      
      if (schema.type === 'string' && typeofDefault !== 'string') {
        throw new EnvValidationError(
          `Invalid default value for ${key}: expected string, got ${typeofDefault}`
        );
      }
      
      if (schema.type === 'number' && typeofDefault !== 'number') {
        throw new EnvValidationError(
          `Invalid default value for ${key}: expected number, got ${typeofDefault}`
        );
      }
      
      if (schema.type === 'boolean' && typeofDefault !== 'boolean') {
        throw new EnvValidationError(
          `Invalid default value for ${key}: expected boolean, got ${typeofDefault}`
        );
      }
      
      if (schema.type === 'number' && isNaN(schema.defaultValue as number)) {
        throw new EnvValidationError(
          `Invalid default value for ${key}: number cannot be NaN`
        );
      }
    }
  }
}
function validateEnv<T extends SchemaDefinition>(
  schemaDefinition: T
): InferEnvType<T> {
  validateSchemaDefaults(schemaDefinition);
  
  const envSource = getEnvSource();
  const result: Record<string, any> = {};
  const errors: string[] = [];

  for (const [key, schema] of Object.entries(schemaDefinition)) {
    try {
      result[key] = parseValue(key, envSource[key], schema);
    } catch (error) {
      if (error instanceof EnvValidationError) {
        errors.push(error.message);
      } else {
        throw error;
      }
    }
  }

  if (errors.length > 0) {
    throw new EnvValidationError(
      `Environment validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`
    );
  }

  return result as InferEnvType<T>;
}
export function defineEnv<T extends Record<string, SchemaBuilder<any>>>(
  definition: T
): InferEnvType<ReturnType<typeof buildSchema<T>>> {
  const schema = buildSchema(definition);
  return validateEnv(schema);
}
