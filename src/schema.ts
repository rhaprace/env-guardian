export type SchemaType = 'string' | 'number' | 'boolean';

export interface BaseSchema<T> {
  type: SchemaType;
  optional: boolean;
  hasDefault: boolean;
  defaultValue?: T;
}

export interface StringSchema extends BaseSchema<string> {
  type: 'string';
}

export interface NumberSchema extends BaseSchema<number> {
  type: 'number';
}

export interface BooleanSchema extends BaseSchema<boolean> {
  type: 'boolean';
}

export type Schema = StringSchema | NumberSchema | BooleanSchema;

export type SchemaDefinition = Record<string, Schema>;

export type InferEnvType<T extends SchemaDefinition> = {
  [K in keyof T]: T[K] extends { optional: true; hasDefault: false }
    ? InferSchemaType<T[K]> | undefined
    : InferSchemaType<T[K]>;
};

type InferSchemaType<S extends Schema> = S extends StringSchema
  ? string
  : S extends NumberSchema
  ? number
  : S extends BooleanSchema
  ? boolean
  : never;

class SchemaBuilder<T> {
  constructor(private schema: BaseSchema<T>) {}

  optional(): SchemaBuilder<T> {
    return new SchemaBuilder({ ...this.schema, optional: true });
  }

  default(value: T): SchemaBuilder<T> {
    return new SchemaBuilder({
      ...this.schema,
      hasDefault: true,
      defaultValue: value,
      optional: false,
    });
  }

  build(): BaseSchema<T> {
    return this.schema;
  }
}
export const ENV = {
  string(): SchemaBuilder<string> {
    return new SchemaBuilder<string>({
      type: 'string',
      optional: false,
      hasDefault: false,
    });
  },

  number(): SchemaBuilder<number> {
    return new SchemaBuilder<number>({
      type: 'number',
      optional: false,
      hasDefault: false,
    });
  },

  boolean(): SchemaBuilder<boolean> {
    return new SchemaBuilder<boolean>({
      type: 'boolean',
      optional: false,
      hasDefault: false,
    });
  },
};

export function buildSchema<T extends Record<string, SchemaBuilder<any>>>(
  definition: T
): SchemaDefinition {
  const schema: SchemaDefinition = {};
  
  for (const [key, builder] of Object.entries(definition)) {
    schema[key] = builder.build();
  }
  
  return schema;
}
