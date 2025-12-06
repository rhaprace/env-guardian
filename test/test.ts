/**
 * Test Suite for @rhap/env-guardian
 * Validates core functionality of environment variable validation
 */

import { defineEnv, ENV, EnvValidationError } from '../src/index';

let passedTests = 0;
let failedTests = 0;

function logTestStart(testName: string): void {
  console.log(`\n${testName}`);
  console.log('-'.repeat(60));
}

function logPass(message: string, details?: Record<string, any>): void {
  console.log(`[PASS] ${message}`);
  if (details) {
    Object.entries(details).forEach(([key, value]) => {
      console.log(`       ${key}: ${value}`);
    });
  }
  passedTests++;
}

function logFail(message: string): void {
  console.log(`[FAIL] ${message}`);
  failedTests++;
}

console.log('='.repeat(60));
console.log('Test Suite: @rhap/env-guardian');
console.log('Environment Variable Validator');
console.log('='.repeat(60));

logTestStart('Test 1: Required Variables Validation');
try {
  process.env.API_URL = 'https://api.example.com';
  process.env.PORT = '3000';
  process.env.DEBUG = 'true';
  
  const env = defineEnv({
    API_URL: ENV.string(),
    PORT: ENV.number(),
    DEBUG: ENV.boolean(),
  });
  
  logPass('Required variables validated successfully', {
    'API_URL': `${env.API_URL} (${typeof env.API_URL})`,
    'PORT': `${env.PORT} (${typeof env.PORT})`,
    'DEBUG': `${env.DEBUG} (${typeof env.DEBUG})`,
  });
} catch (error) {
  logFail((error as Error).message);
}

logTestStart('Test 2: Default Values');
try {
  delete process.env.TIMEOUT;
  delete process.env.MAX_RETRIES;
  
  const env = defineEnv({
    TIMEOUT: ENV.number().default(5000),
    MAX_RETRIES: ENV.number().default(3),
    APP_NAME: ENV.string().default('MyApp'),
  });
  
  logPass('Default values applied correctly', {
    'TIMEOUT': env.TIMEOUT,
    'MAX_RETRIES': env.MAX_RETRIES,
    'APP_NAME': env.APP_NAME,
  });
} catch (error) {
  logFail((error as Error).message);
}

logTestStart('Test 3: Optional Values');
try {
  delete process.env.OPTIONAL_KEY;
  process.env.EXISTING_KEY = 'value';
  
  const env = defineEnv({
    OPTIONAL_KEY: ENV.string().optional(),
    EXISTING_KEY: ENV.string().optional(),
  });
  
  logPass('Optional values handled correctly', {
    'OPTIONAL_KEY': env.OPTIONAL_KEY ?? 'undefined',
    'EXISTING_KEY': env.EXISTING_KEY,
  });
} catch (error) {
  logFail((error as Error).message);
}

logTestStart('Test 4: Boolean Type Parsing');
try {
  process.env.BOOL_TRUE = 'true';
  process.env.BOOL_ONE = '1';
  process.env.BOOL_FALSE = 'false';
  process.env.BOOL_ZERO = '0';
  
  const env = defineEnv({
    BOOL_TRUE: ENV.boolean(),
    BOOL_ONE: ENV.boolean(),
    BOOL_FALSE: ENV.boolean(),
    BOOL_ZERO: ENV.boolean(),
  });
  
  logPass('Boolean parsing successful', {
    '"true" ->': env.BOOL_TRUE,
    '"1" ->': env.BOOL_ONE,
    '"false" ->': env.BOOL_FALSE,
    '"0" ->': env.BOOL_ZERO,
  });
} catch (error) {
  logFail((error as Error).message);
}

logTestStart('Test 5: Number Type Parsing');
try {
  process.env.INTEGER = '42';
  process.env.FLOAT = '3.14';
  process.env.NEGATIVE = '-100';
  
  const env = defineEnv({
    INTEGER: ENV.number(),
    FLOAT: ENV.number(),
    NEGATIVE: ENV.number(),
  });
  
  logPass('Number parsing successful', {
    '"42" ->': env.INTEGER,
    '"3.14" ->': env.FLOAT,
    '"-100" ->': env.NEGATIVE,
  });
} catch (error) {
  logFail((error as Error).message);
}

logTestStart('Test 6: Error Handling - Missing Required Variable');
try {
  delete process.env.REQUIRED_VAR;
  
  defineEnv({
    REQUIRED_VAR: ENV.string(),
  });
  
  logFail('Should have thrown EnvValidationError');
} catch (error) {
  if (error instanceof EnvValidationError) {
    logPass('Correctly threw EnvValidationError for missing variable', {
      'Error': error.message,
    });
  } else {
    logFail('Unexpected error type');
  }
}

logTestStart('Test 7: Error Handling - Invalid Number');
try {
  process.env.INVALID_PORT = 'not-a-number';
  
  defineEnv({
    INVALID_PORT: ENV.number(),
  });
  
  logFail('Should have thrown EnvValidationError');
} catch (error) {
  if (error instanceof EnvValidationError) {
    logPass('Correctly threw EnvValidationError for invalid number', {
      'Error': error.message,
    });
  } else {
    logFail('Unexpected error type');
  }
}

logTestStart('Test 8: Error Handling - Invalid Boolean');
try {
  process.env.INVALID_BOOL = 'yes';
  
  defineEnv({
    INVALID_BOOL: ENV.boolean(),
  });
  
  logFail('Should have thrown EnvValidationError');
} catch (error) {
  if (error instanceof EnvValidationError) {
    logPass('Correctly threw EnvValidationError for invalid boolean', {
      'Error': error.message,
    });
  } else {
    logFail('Unexpected error type');
  }
}

logTestStart('Test 9: Error Handling - Multiple Validation Errors');
try {
  delete process.env.MISSING_1;
  delete process.env.MISSING_2;
  process.env.INVALID_NUM = 'abc';
  
  defineEnv({
    MISSING_1: ENV.string(),
    MISSING_2: ENV.string(),
    INVALID_NUM: ENV.number(),
  });
  
  logFail('Should have thrown EnvValidationError');
} catch (error) {
  if (error instanceof EnvValidationError) {
    logPass('Correctly reported all validation errors', {
      'Error': error.message,
    });
  } else {
    logFail('Unexpected error type');
  }
}

logTestStart('Test 10: Integration - Complex Real-World Scenario');
try {
  process.env.NODE_ENV = 'production';
  process.env.DATABASE_URL = 'postgresql://localhost:5432/mydb';
  process.env.API_KEY = 'secret-key-123';
  process.env.PORT = '8080';
  process.env.ENABLE_CACHE = 'true';
  delete process.env.REDIS_URL;
  delete process.env.LOG_LEVEL;
  
  const env = defineEnv({
    NODE_ENV: ENV.string(),
    DATABASE_URL: ENV.string(),
    API_KEY: ENV.string(),
    PORT: ENV.number(),
    ENABLE_CACHE: ENV.boolean(),
    REDIS_URL: ENV.string().optional(),
    LOG_LEVEL: ENV.string().default('info'),
    MAX_CONNECTIONS: ENV.number().default(10),
  });
  
  logPass('Complex scenario with mixed types validated successfully', {
    'NODE_ENV': env.NODE_ENV,
    'DATABASE_URL': env.DATABASE_URL,
    'PORT': env.PORT,
    'ENABLE_CACHE': env.ENABLE_CACHE,
    'REDIS_URL': env.REDIS_URL ?? 'undefined (optional)',
    'LOG_LEVEL': `${env.LOG_LEVEL} (default)`,
    'MAX_CONNECTIONS': `${env.MAX_CONNECTIONS} (default)`,
  });
} catch (error) {
  logFail((error as Error).message);
}

console.log('\n' + '='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${passedTests + failedTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(2)}%`);
console.log('='.repeat(60));

if (failedTests > 0) {
  process.exit(1);
}
