import { beforeAll, afterAll, afterEach } from 'vitest';

// Setup global test utilities
beforeAll(() => {
  // Mock environment variables for tests
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.NEXTAUTH_SECRET = 'test-secret';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  process.env.AI_PROVIDER = 'LOCAL';
});

afterEach(() => {
  // Clean up after each test
});

afterAll(() => {
  // Global cleanup
});

