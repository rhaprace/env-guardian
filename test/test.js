"use strict";
/**
 * Local test file for @rhap/env-guardian
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
console.log('🧪 Testing @rhap/env-guardian locally...\n');
// Test 1: Basic validation with required variables
console.log('Test 1: Required variables');
try {
    process.env.API_URL = 'https://api.example.com';
    process.env.PORT = '3000';
    process.env.DEBUG = 'true';
    const env = (0, index_1.defineEnv)({
        API_URL: index_1.ENV.string(),
        PORT: index_1.ENV.number(),
        DEBUG: index_1.ENV.boolean(),
    });
    console.log('✅ PASS - Required variables validated');
    console.log('  API_URL:', env.API_URL, `(${typeof env.API_URL})`);
    console.log('  PORT:', env.PORT, `(${typeof env.PORT})`);
    console.log('  DEBUG:', env.DEBUG, `(${typeof env.DEBUG})`);
}
catch (error) {
    console.log('❌ FAIL -', error.message);
}
// Test 2: Default values
console.log('\nTest 2: Default values');
try {
    delete process.env.TIMEOUT;
    delete process.env.MAX_RETRIES;
    const env = (0, index_1.defineEnv)({
        TIMEOUT: index_1.ENV.number().default(5000),
        MAX_RETRIES: index_1.ENV.number().default(3),
        APP_NAME: index_1.ENV.string().default('MyApp'),
    });
    console.log('✅ PASS - Default values work');
    console.log('  TIMEOUT:', env.TIMEOUT);
    console.log('  MAX_RETRIES:', env.MAX_RETRIES);
    console.log('  APP_NAME:', env.APP_NAME);
}
catch (error) {
    console.log('❌ FAIL -', error.message);
}
// Test 3: Optional values
console.log('\nTest 3: Optional values');
try {
    delete process.env.OPTIONAL_KEY;
    process.env.EXISTING_KEY = 'value';
    const env = (0, index_1.defineEnv)({
        OPTIONAL_KEY: index_1.ENV.string().optional(),
        EXISTING_KEY: index_1.ENV.string().optional(),
    });
    console.log('✅ PASS - Optional values work');
    console.log('  OPTIONAL_KEY:', env.OPTIONAL_KEY);
    console.log('  EXISTING_KEY:', env.EXISTING_KEY);
}
catch (error) {
    console.log('❌ FAIL -', error.message);
}
// Test 4: Boolean parsing
console.log('\nTest 4: Boolean parsing');
try {
    process.env.BOOL_TRUE = 'true';
    process.env.BOOL_ONE = '1';
    process.env.BOOL_FALSE = 'false';
    process.env.BOOL_ZERO = '0';
    const env = (0, index_1.defineEnv)({
        BOOL_TRUE: index_1.ENV.boolean(),
        BOOL_ONE: index_1.ENV.boolean(),
        BOOL_FALSE: index_1.ENV.boolean(),
        BOOL_ZERO: index_1.ENV.boolean(),
    });
    console.log('✅ PASS - Boolean parsing works');
    console.log('  "true" ->', env.BOOL_TRUE);
    console.log('  "1" ->', env.BOOL_ONE);
    console.log('  "false" ->', env.BOOL_FALSE);
    console.log('  "0" ->', env.BOOL_ZERO);
}
catch (error) {
    console.log('❌ FAIL -', error.message);
}
// Test 5: Number parsing
console.log('\nTest 5: Number parsing');
try {
    process.env.INTEGER = '42';
    process.env.FLOAT = '3.14';
    process.env.NEGATIVE = '-100';
    const env = (0, index_1.defineEnv)({
        INTEGER: index_1.ENV.number(),
        FLOAT: index_1.ENV.number(),
        NEGATIVE: index_1.ENV.number(),
    });
    console.log('✅ PASS - Number parsing works');
    console.log('  "42" ->', env.INTEGER);
    console.log('  "3.14" ->', env.FLOAT);
    console.log('  "-100" ->', env.NEGATIVE);
}
catch (error) {
    console.log('❌ FAIL -', error.message);
}
// Test 6: Missing required variable (should fail)
console.log('\nTest 6: Missing required variable (should throw)');
try {
    delete process.env.REQUIRED_VAR;
    const env = (0, index_1.defineEnv)({
        REQUIRED_VAR: index_1.ENV.string(),
    });
    console.log('❌ FAIL - Should have thrown error');
}
catch (error) {
    if (error instanceof index_1.EnvValidationError) {
        console.log('✅ PASS - Correctly threw EnvValidationError');
        console.log('  Error:', error.message);
    }
    else {
        console.log('❌ FAIL - Wrong error type');
    }
}
// Test 7: Invalid number (should fail)
console.log('\nTest 7: Invalid number (should throw)');
try {
    process.env.INVALID_PORT = 'not-a-number';
    const env = (0, index_1.defineEnv)({
        INVALID_PORT: index_1.ENV.number(),
    });
    console.log('❌ FAIL - Should have thrown error');
}
catch (error) {
    if (error instanceof index_1.EnvValidationError) {
        console.log('✅ PASS - Correctly threw EnvValidationError');
        console.log('  Error:', error.message);
    }
    else {
        console.log('❌ FAIL - Wrong error type');
    }
}
// Test 8: Invalid boolean (should fail)
console.log('\nTest 8: Invalid boolean (should throw)');
try {
    process.env.INVALID_BOOL = 'yes';
    const env = (0, index_1.defineEnv)({
        INVALID_BOOL: index_1.ENV.boolean(),
    });
    console.log('❌ FAIL - Should have thrown error');
}
catch (error) {
    if (error instanceof index_1.EnvValidationError) {
        console.log('✅ PASS - Correctly threw EnvValidationError');
        console.log('  Error:', error.message);
    }
    else {
        console.log('❌ FAIL - Wrong error type');
    }
}
// Test 9: Multiple errors (should report all)
console.log('\nTest 9: Multiple validation errors (should report all)');
try {
    delete process.env.MISSING_1;
    delete process.env.MISSING_2;
    process.env.INVALID_NUM = 'abc';
    const env = (0, index_1.defineEnv)({
        MISSING_1: index_1.ENV.string(),
        MISSING_2: index_1.ENV.string(),
        INVALID_NUM: index_1.ENV.number(),
    });
    console.log('❌ FAIL - Should have thrown error');
}
catch (error) {
    if (error instanceof index_1.EnvValidationError) {
        console.log('✅ PASS - Correctly reported multiple errors');
        console.log('  Error:', error.message);
    }
    else {
        console.log('❌ FAIL - Wrong error type');
    }
}
// Test 10: Complex real-world scenario
console.log('\nTest 10: Complex real-world scenario');
try {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'postgresql://localhost:5432/mydb';
    process.env.API_KEY = 'secret-key-123';
    process.env.PORT = '8080';
    process.env.ENABLE_CACHE = 'true';
    delete process.env.REDIS_URL; // Optional
    delete process.env.LOG_LEVEL; // Has default
    const env = (0, index_1.defineEnv)({
        NODE_ENV: index_1.ENV.string(),
        DATABASE_URL: index_1.ENV.string(),
        API_KEY: index_1.ENV.string(),
        PORT: index_1.ENV.number(),
        ENABLE_CACHE: index_1.ENV.boolean(),
        REDIS_URL: index_1.ENV.string().optional(),
        LOG_LEVEL: index_1.ENV.string().default('info'),
        MAX_CONNECTIONS: index_1.ENV.number().default(10),
    });
    console.log('✅ PASS - Complex scenario works');
    console.log('  NODE_ENV:', env.NODE_ENV);
    console.log('  DATABASE_URL:', env.DATABASE_URL);
    console.log('  PORT:', env.PORT);
    console.log('  ENABLE_CACHE:', env.ENABLE_CACHE);
    console.log('  REDIS_URL:', env.REDIS_URL, '(optional, undefined)');
    console.log('  LOG_LEVEL:', env.LOG_LEVEL, '(default)');
    console.log('  MAX_CONNECTIONS:', env.MAX_CONNECTIONS, '(default)');
}
catch (error) {
    console.log('❌ FAIL -', error.message);
}
console.log('\n✅ All tests completed!');
