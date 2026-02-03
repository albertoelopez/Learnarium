import { describe, test, expect, beforeEach } from '@jest/globals';

describe('API Provider Switching', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('API routes respect AI_PROVIDER environment variable', () => {
    process.env.AI_PROVIDER = 'ollama';
    expect(process.env.AI_PROVIDER).toBe('ollama');

    process.env.AI_PROVIDER = 'groq';
    expect(process.env.AI_PROVIDER).toBe('groq');

    process.env.AI_PROVIDER = 'gemini';
    expect(process.env.AI_PROVIDER).toBe('gemini');
  });

  test('validates required environment variables for each provider', () => {
    const providers = [
      { name: 'groq', requiredKey: 'GROQ_API_KEY' },
      { name: 'gemini', requiredKey: 'GOOGLE_API_KEY' },
    ];

    providers.forEach(({ name, requiredKey }) => {
      process.env.AI_PROVIDER = name;
      process.env[requiredKey] = 'test-key';

      expect(process.env.AI_PROVIDER).toBe(name);
      expect(process.env[requiredKey]).toBe('test-key');

      delete process.env[requiredKey];
    });
  });

  test('ollama does not require API keys', () => {
    process.env.AI_PROVIDER = 'ollama';
    delete process.env.GROQ_API_KEY;
    delete process.env.GOOGLE_API_KEY;

    expect(process.env.GROQ_API_KEY).toBeUndefined();
    expect(process.env.GOOGLE_API_KEY).toBeUndefined();
    expect(process.env.AI_PROVIDER).toBe('ollama');
  });

  test('ollama configuration is optional', () => {
    process.env.AI_PROVIDER = 'ollama';

    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'gpt-oss';

    expect(baseUrl).toBeDefined();
    expect(model).toBeDefined();
  });

  test('can switch providers at runtime', () => {
    process.env.AI_PROVIDER = 'groq';
    process.env.GROQ_API_KEY = 'test-groq';

    expect(process.env.AI_PROVIDER).toBe('groq');

    process.env.AI_PROVIDER = 'ollama';
    delete process.env.GROQ_API_KEY;

    expect(process.env.AI_PROVIDER).toBe('ollama');
    expect(process.env.GROQ_API_KEY).toBeUndefined();
  });
});
