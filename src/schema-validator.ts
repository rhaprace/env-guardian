import type { SchemaDefinition } from './schema';
import { EnvValidationError } from './errors';

export class SchemaValidator {
  validate(schemaDefinition: SchemaDefinition): void {
    for (const [key, schema] of Object.entries(schemaDefinition)) {
      this.validateSchemaEntry(key, schema);
    }
  }

  private validateSchemaEntry(key: string, schema: SchemaDefinition[string]): void {
    if (!schema.hasDefault || schema.defaultValue === undefined) {
      return;
    }

    const actualType = typeof schema.defaultValue;
    const expectedType = schema.type;

    if (actualType !== expectedType) {
      throw new EnvValidationError(
        `Invalid default value for ${key}: expected ${expectedType}, got ${actualType}`
      );
    }

    if (expectedType === 'number' && isNaN(schema.defaultValue as number)) {
      throw new EnvValidationError(
        `Invalid default value for ${key}: number cannot be NaN`
      );
    }
  }
}
