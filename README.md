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

**env-guardian** provides clear, actionable error messages to help you identify and fix issues quickly.

### Missing Required Variable

```bash
# Missing API_URL environment variable
```

```typescript
defineEnv({
  API_URL: ENV.string(),
});
```

**Error:**
```
EnvValidationError: Environment validation failed:
  - Missing required environment variable: API_URL
```

---

### Invalid Type Conversion

```bash
# PORT=abc
```

```typescript
defineEnv({
  PORT: ENV.number(),
});
```

**Error:**
```
EnvValidationError: Environment validation failed:
  - Invalid number for PORT: expected number, got "abc"
```

---

### Invalid Boolean Value

```bash
# DEBUG=yes
```

```typescript
defineEnv({
  DEBUG: ENV.boolean(),
});
```

**Error:**
```
EnvValidationError: Environment validation failed:
  - Invalid boolean for DEBUG: expected "true", "false", "1", or "0", got "yes"
```

---

### Multiple Validation Errors

```bash
# Multiple issues in environment
```

```typescript
defineEnv({
  API_URL: ENV.string(),
  PORT: ENV.number(),
  DEBUG: ENV.boolean(),
});
```

**Error:**
```
EnvValidationError: Environment validation failed:
  - Missing required environment variable: API_URL
  - Invalid number for PORT: expected number, got "abc"
  - Missing required environment variable: DEBUG
```

## TypeScript Type Inference

The library automatically infers precise TypeScript types from your schema:

```typescript
const env = defineEnv({
  API_URL: ENV.string(),                    
  PORT: ENV.number(),                       
  DEBUG: ENV.boolean(),                     
  OPTIONAL_KEY: ENV.string().optional(),    
  DEFAULT_TIMEOUT: ENV.number().default(5000),
});

// Inferred type:
// {
//   API_URL: string;
//   PORT: number;
//   DEBUG: boolean;
//   OPTIONAL_KEY: string | undefined;
//   DEFAULT_TIMEOUT: number;
// }
```

This enables full IDE autocomplete and compile-time type checking throughout your application.

## Best Practices

### 1. Centralize Environment Configuration

Create a single source of truth for environment variables:

```typescript
// config/env.ts
import { defineEnv, ENV } from '@rhap/env-guardian';

export const env = defineEnv({
  // Define all environment variables here
});
```

### 2. Validate Early

Call `defineEnv` at application startup to fail fast on configuration errors:

```typescript
// index.ts or main.ts
import { env } from './config/env';

// Environment is validated before app initialization
startServer(env.PORT);
```

### 3. Use Descriptive Variable Names

Follow platform conventions:

```typescript
// Node.js
NODE_ENV, DATABASE_URL, API_KEY

// Vite (must be prefixed with VITE_)
VITE_API_URL, VITE_APP_TITLE

// Next.js (public variables must be prefixed)
NEXT_PUBLIC_API_URL, DATABASE_URL
```

### 4. Leverage Type Safety

Let TypeScript catch errors at compile time:

```typescript
const env = defineEnv({
  PORT: ENV.number().default(3000),
});

// ✅ Type-safe
const port: number = env.PORT;

// ❌ TypeScript error
const port: string = env.PORT;
```

## Installation & Setup

### Install Package

```bash
npm install @rhap/env-guardian
```

### Build from Source

```bash
# Clone repository
git clone https://github.com/your-org/env-guardian.git
cd env-guardian

# Install dependencies
npm install

# Build TypeScript
npm run build

# Output will be in dist/
```

### Publishing

```bash
npm publish --access public
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT © 2025

---

**@rhap/env-guardian** - Type-safe environment validation for modern JavaScript applications.
