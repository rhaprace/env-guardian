# env-validator-zero

Zero-dependency environment variable validator with full TypeScript support for Node.js, React, and Vite.

## Features

- **Zero dependencies** - Lightweight and secure
- **TypeScript inference** - Full autocomplete and type safety
- **Universal** - Works with Node.js, Vite, and React
- **Clear errors** - Descriptive validation messages

## Installation

```bash
npm install env-validator-zero
```

## Usage

```typescript
import { defineEnv, ENV } from 'env-validator-zero';

export const env = defineEnv({
  API_URL: ENV.string(),
  PORT: ENV.number().default(3000),
  DEBUG: ENV.boolean().optional(),
});

// Fully typed
console.log(env.API_URL);  // string
console.log(env.PORT);     // number
console.log(env.DEBUG);    // boolean | undefined
```

## Schema Builders

**ENV.string()** - String values
- `.optional()` - Makes variable optional
- `.default(value)` - Provides fallback value

**ENV.number()** - Numeric values (parses strings automatically)
- `.optional()` - Makes variable optional
- `.default(value)` - Provides fallback value

**ENV.boolean()** - Boolean values (accepts: `"true"`, `"false"`, `"1"`, `"0"`)
- `.optional()` - Makes variable optional
- `.default(value)` - Provides fallback value

## Error Handling

```typescript
import { defineEnv, ENV, EnvValidationError } from 'env-validator-zero';

try {
  const env = defineEnv({
    API_KEY: ENV.string(),
  });
} catch (error) {
  if (error instanceof EnvValidationError) {
    console.error(error.message);
    process.exit(1);
  }
}
```

**Error messages:**
- Missing variables: `Missing required environment variable: API_KEY`
- Invalid types: `Invalid number for PORT: expected number, got "abc"`
- Multiple errors: Lists all validation failures

## Examples

### Node.js

```typescript
import { defineEnv, ENV } from 'env-validator-zero';

export const env = defineEnv({
  NODE_ENV: ENV.string().default('development'),
  DATABASE_URL: ENV.string(),
  PORT: ENV.number().default(3000),
  ENABLE_LOGGING: ENV.boolean().default(true),
});
```

### Vite/React

```typescript
import { defineEnv, ENV } from 'env-validator-zero';

export const env = defineEnv({
  VITE_API_URL: ENV.string(),
  VITE_APP_TITLE: ENV.string().default('My App'),
  VITE_ENABLE_ANALYTICS: ENV.boolean().default(false),
});
```

### Next.js

```typescript
import { defineEnv, ENV } from 'env-validator-zero';

export const env = defineEnv({
  NEXT_PUBLIC_API_URL: ENV.string(),
  DATABASE_URL: ENV.string(),
  JWT_SECRET: ENV.string(),
});
```

## License

MIT  2025
