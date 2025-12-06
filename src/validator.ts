import type { SchemaDefinition, InferEnvType, SchemaBuilder } from './schema';
import { buildSchema } from './schema';
import { EnvValidationError } from './errors';
import { EnvironmentSourceFactory } from './env-source';
import type { EnvironmentSource } from './env-source';
import { ParserFactory } from './parsers';
import { ValueResolver } from './value-resolver';
import { SchemaValidator } from './schema-validator';

class EnvironmentValidator {
  constructor(
    private envSource: EnvironmentSource,
    private schemaValidator: SchemaValidator,
    private valueResolver: ValueResolver
  ) {}

  validate<T extends SchemaDefinition>(schemaDefinition: T): InferEnvType<T> {
    this.schemaValidator.validate(schemaDefinition);

    const result: Record<string, any> = {};
    const errors: string[] = [];

    for (const [key, schema] of Object.entries(schemaDefinition)) {
      try {
        const value = this.envSource.get(key);
        const parser = ParserFactory.getParser(schema.type);
        result[key] = this.valueResolver.resolve(key, value, schema, parser);
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
}

export function defineEnv<T extends Record<string, SchemaBuilder<any>>>(
  definition: T
): InferEnvType<ReturnType<typeof buildSchema<T>>> {
  const schema = buildSchema(definition);
  
  const validator = new EnvironmentValidator(
    EnvironmentSourceFactory.create(),
    new SchemaValidator(),
    new ValueResolver()
  );
  
  return validator.validate(schema);
}

export { EnvValidationError } from './errors';

