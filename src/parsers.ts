import type { SchemaType } from './schema';
import { EnvValidationError } from './errors';

export abstract class TypeParser<T> {
  abstract parse(key: string, value: string): T;
  
  protected createError(key: string, expected: string, received: string): EnvValidationError {
    return new EnvValidationError(
      `Invalid ${expected} for ${key}: expected ${expected}, got "${received}"`
    );
  }
}
export class StringParser extends TypeParser<string> {
  parse(_key: string, value: string): string {
    return value;
  }
}
export class NumberParser extends TypeParser<number> {
  parse(key: string, value: string): number {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw this.createError(key, 'number', value);
    }
    return parsed;
  }
}
export class BooleanParser extends TypeParser<boolean> {
  private readonly truthyValues = new Set(['true', '1']);
  private readonly falsyValues = new Set(['false', '0', '']);

  parse(key: string, value: string): boolean {
    const lower = value.toLowerCase();
    
    if (this.truthyValues.has(lower)) {
      return true;
    }
    
    if (this.falsyValues.has(lower)) {
      return false;
    }
    
    throw new EnvValidationError(
      `Invalid boolean for ${key}: expected "true", "false", "1", or "0", got "${value}"`
    );
  }
}
export class ParserFactory {
  private static parsers = new Map<SchemaType, TypeParser<any>>([
    ['string', new StringParser()],
    ['number', new NumberParser()],
    ['boolean', new BooleanParser()],
  ]);

  static getParser(type: SchemaType): TypeParser<any> {
    const parser = this.parsers.get(type);
    if (!parser) {
      throw new Error(`Unknown schema type: ${type}`);
    }
    return parser;
  }
}
