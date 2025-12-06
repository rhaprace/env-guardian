# @rhap/env-guardian

A production-ready, zero-dependency environment variable validator with full TypeScript support. Designed for Node.js, React, and Vite applications with a clean, schema-based API.

## Why env-guardian?

Managing environment variables in modern applications is error-prone. Missing variables, incorrect types, and runtime errors can cause production failures. **env-guardian** provides compile-time and runtime safety with:

- **Zero runtime dependencies** - Lightweight and secure
- **Full TypeScript inference** - Autocomplete and type safety from schema
- **Universal compatibility** - Works seamlessly with Node.js and Vite/React
- **Descriptive error messages** - Know exactly what's wrong and where
- **Developer-friendly API** - Intuitive schema builder with fluent syntax

## Installation

```bash
npm install @rhap/env-guardian
```

```bash
yarn add @rhap/env-guardian
```

```bash
pnpm add @rhap/env-guardian
```

## Quick Start

Define your environment schema and let TypeScript do the rest:

```typescript
import { defineEnv, ENV } from '@rhap/env-guardian';

export const env = defineEnv({
  API_URL: ENV.string(),
  PORT: ENV.number().default(3000),
  DEBUG: ENV.boolean().optional(),
});

// Fully typed environment object
console.log(env.API_URL);  // string
console.log(env.PORT);     // number (defaults to 3000 if not set)
console.log(env.DEBUG);    // boolean | undefined
```

## API Reference

### `defineEnv(schema)`

Validates environment variables against a schema and returns a strongly-typed object.

**Parameters:**
- `schema` - Schema definition using `ENV` builders

**Returns:**
- Validated environment object with inferred types

**Throws:**
- `EnvValidationError` - When validation fails

**Example:**
```typescript
const env = defineEnv({
  API_KEY: ENV.string(),
  TIMEOUT: ENV.number().default(5000),
});
```

---

### `ENV.string()`

Creates a string schema.

**Chain methods:**
- `.optional()` - Makes the variable optional (`string | undefined`)
- `.default(value: string)` - Provides a fallback value

**Examples:**
```typescript
API_URL: ENV.string()                     // Required string
BASE_PATH: ENV.string().optional()        // Optional string
APP_NAME: ENV.string().default('MyApp')   // String with default
```

---

### `ENV.number()`

Creates a number schema. Parses numeric strings automatically.

**Chain methods:**
- `.optional()` - Makes the variable optional (`number | undefined`)
- `.default(value: number)` - Provides a fallback value

**Examples:**
```typescript
PORT: ENV.number()                        // Required number
MAX_RETRY: ENV.number().optional()        // Optional number
TIMEOUT: ENV.number().default(3000)       // Number with default
```

---

### `ENV.boolean()`

Creates a boolean schema.

**Accepted values:**
- **true**: `"true"`, `"1"`
- **false**: `"false"`, `"0"`, `""` (empty string)

**Chain methods:**
- `.optional()` - Makes the variable optional (`boolean | undefined`)
- `.default(value: boolean)` - Provides a fallback value

**Examples:**
```typescript
DEBUG: ENV.boolean()                      // Required boolean
VERBOSE: ENV.boolean().optional()         // Optional boolean
CACHE: ENV.boolean().default(true)        // Boolean with default
```

---

### `EnvValidationError`

Custom error class thrown when validation fails.

**Example:**
```typescript
import { defineEnv, ENV, EnvValidationError } from '@rhap/env-guardian';

try {
  const env = defineEnv({
    REQUIRED_VAR: ENV.string(),
  });
} catch (error) {
  if (error instanceof EnvValidationError) {
    console.error(error.message);
    process.exit(1);
  }
}
```

## Usage Examples

### Node.js Application

```typescript
// config/env.ts
import { defineEnv, ENV } from '@rhap/env-guardian';

export const env = defineEnv({
  NODE_ENV: ENV.string().default('development'),
  PORT: ENV.number().default(3000),
  DATABASE_URL: ENV.string(),
  REDIS_URL: ENV.string().optional(),
  API_KEY: ENV.string(),
  ENABLE_LOGGING: ENV.boolean().default(true),
});

// server.ts
import express from 'express';
import { env } from './config/env';

const app = express();

app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
```

---

### Vite + React Application

```typescript
// src/config/env.ts
import { defineEnv, ENV } from '@rhap/env-guardian';

export const env = defineEnv({
  VITE_API_URL: ENV.string(),
  VITE_APP_TITLE: ENV.string().default('My Application'),
  VITE_ENABLE_ANALYTICS: ENV.boolean().default(false),
  VITE_MAX_UPLOAD_SIZE: ENV.number().default(5242880), // 5MB
});

// src/App.tsx
import { env } from './config/env';

function App() {
  return (
    <div>
      <h1>{env.VITE_APP_TITLE}</h1>
      <p>API: {env.VITE_API_URL}</p>
    </div>
  );
}
```

---

### Next.js Application

```typescript
// lib/env.ts
import { defineEnv, ENV } from '@rhap/env-guardian';

export const env = defineEnv({
  NEXT_PUBLIC_API_URL: ENV.string(),
  DATABASE_URL: ENV.string(),
  JWT_SECRET: ENV.string(),
  NEXT_PUBLIC_GA_ID: ENV.string().optional(),
});
```

## Error Handling

### Missing Required Variable

```typescript
// Missing API_URL
defineEnv({
  API_URL: ENV.string(),
});

// Throws:
// EnvValidationError: Environment validation failed:
//   - Missing required environment variable: API_URL
```

### Invalid Type

```typescript
// PORT=abc (not a number)
defineEnv({
  PORT: ENV.number(),
});

// Throws:
// EnvValidationError: Environment validation failed:
//   - Invalid number for PORT: expected number, got "abc"
```

### Invalid Boolean

```typescript
// DEBUG=yes (not a valid boolean)
defineEnv({
  DEBUG: ENV.boolean(),
});

// Throws:
// EnvValidationError: Environment validation failed:
//   - Invalid boolean for DEBUG: expected "true", "false", "1", or "0", got "yes"
```

### Invalid Default

```typescript
// Invalid default type
defineEnv({
  PORT: ENV.number().default('3000'), // TypeScript error + runtime error
});

// Throws:
// EnvValidationError: Invalid default value for PORT: expected number, got string
```

### Multiple Errors

```typescript
// Multiple missing variables
defineEnv({
  API_URL: ENV.string(),
  DATABASE_URL: ENV.string(),
  PORT: ENV.number(),
});

// Throws:
// EnvValidationError: Environment validation failed:
//   - Missing required environment variable: API_URL
//   - Missing required environment variable: DATABASE_URL
//   - Missing required environment variable: PORT
```

## Type Inference

The package provides full TypeScript type inference:

```typescript
const env = defineEnv({
  API_URL: ENV.string(),                      // string
  PORT: ENV.number(),                         // number
  DEBUG: ENV.boolean(),                       // boolean
  OPTIONAL_URL: ENV.string().optional(),      // string | undefined
  DEFAULT_PORT: ENV.number().default(3000),   // number
});

// Type of env:
// {
//   API_URL: string;
//   PORT: number;
//   DEBUG: boolean;
//   OPTIONAL_URL: string | undefined;
//   DEFAULT_PORT: number;
// }
```

## Best Practices

1. **Define env early** - Validate environment variables at application startup
2. **Single source of truth** - Export from a single `env.ts` file
3. **Fail fast** - Let validation errors crash the app during startup
4. **Type safety** - Use the inferred types throughout your application

```typescript
// ✅ Good: Single env file
// env.ts
export const env = defineEnv({ ... });

// app.ts
import { env } from './env';

// ❌ Bad: Multiple validation points
// Validating in different files can lead to inconsistencies
```

## Build & Publish

### Build

```bash
npm install
npm run build
```

This compiles TypeScript to the `dist/` directory.

### Publish to npm

```bash
npm publish --access public
```

## Development

### Project Structure

```
@rhap/env-guardian/
├── src/
│   ├── index.ts       # Main exports
│   ├── schema.ts      # Schema types and builders
│   └── validator.ts   # Validation engine
├── dist/              # Compiled output (generated)
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

### Local Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test locally in another project
npm link
cd /path/to/test-project
npm link @rhap/env-guardian
```

## License

MIT © [Your Name/Organization]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/env-guardian/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-org/env-guardian/discussions)
