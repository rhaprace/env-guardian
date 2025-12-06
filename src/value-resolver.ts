import type { Schema } from './schema';
import type { TypeParser } from './parsers';
import { EnvValidationError } from './errors';

export class ValueResolver {
  resolve<T>(
    key: string,
    value: string | undefined,
    schema: Schema,
    parser: TypeParser<T>
  ): T | undefined {
    if (value === undefined || value === '') {
      return this.handleMissingValue(key, schema);
    }

    return parser.parse(key, value);
  }

  private handleMissingValue<T>(key: string, schema: Schema): T | undefined {
    if (schema.hasDefault) {
      return schema.defaultValue as T;
    }
    
    if (schema.optional) {
      return undefined;
    }
    
    throw new EnvValidationError(
      `Missing required environment variable: ${key}`
    );
  }
}
