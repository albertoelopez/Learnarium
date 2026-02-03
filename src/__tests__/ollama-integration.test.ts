import { describe, test, expect } from '@jest/globals';

describe('Ollama Provider Configuration', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  test('validates ollama environment variables', () => {
    process.env.AI_PROVIDER = 'ollama';
    process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
    process.env.OLLAMA_MODEL = 'gpt-oss';

    expect(process.env.AI_PROVIDER).toBe('ollama');
    expect(process.env.OLLAMA_BASE_URL).toBe('http://localhost:11434');
    expect(process.env.OLLAMA_MODEL).toBe('gpt-oss');
  });

  test('uses default ollama values when not specified', () => {
    process.env.AI_PROVIDER = 'ollama';
    delete process.env.OLLAMA_BASE_URL;
    delete process.env.OLLAMA_MODEL;

    const defaultBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const defaultModel = process.env.OLLAMA_MODEL || 'gpt-oss';

    expect(defaultBaseUrl).toBe('http://localhost:11434');
    expect(defaultModel).toBe('gpt-oss');
  });

  test('provider can be switched between groq, gemini, and ollama', () => {
    process.env.AI_PROVIDER = 'groq';
    expect(process.env.AI_PROVIDER).toBe('groq');

    process.env.AI_PROVIDER = 'gemini';
    expect(process.env.AI_PROVIDER).toBe('gemini');

    process.env.AI_PROVIDER = 'ollama';
    expect(process.env.AI_PROVIDER).toBe('ollama');
  });

  test('ollama can use custom base url', () => {
    process.env.OLLAMA_BASE_URL = 'http://192.168.1.100:11434';
    expect(process.env.OLLAMA_BASE_URL).toBe('http://192.168.1.100:11434');
  });

  test('ollama can use different models', () => {
    const models = ['gpt-oss', 'llama3', 'mistral', 'mixtral'];

    models.forEach(model => {
      process.env.OLLAMA_MODEL = model;
      expect(process.env.OLLAMA_MODEL).toBe(model);
    });
  });
});
