import { describe, test, expect, beforeEach } from '@jest/globals';
import { getModel } from '../lib/get-model';

describe('getModel', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  test('throws error when provider is groq but no API key', () => {
    process.env.AI_PROVIDER = 'groq';
    delete process.env.GROQ_API_KEY;

    expect(() => getModel()).toThrow('GROQ_API_KEY is not set');
  });

  test('throws error when provider is gemini but no API key', () => {
    process.env.AI_PROVIDER = 'gemini';
    delete process.env.GOOGLE_API_KEY;

    expect(() => getModel()).toThrow('GOOGLE_API_KEY is not set');
  });

  test('throws error for unknown provider', () => {
    process.env.AI_PROVIDER = 'unknown';

    expect(() => getModel()).toThrow('Unknown AI provider: unknown');
  });

  test('returns ChatGroq when provider is groq', () => {
    process.env.AI_PROVIDER = 'groq';
    process.env.GROQ_API_KEY = 'test-key';

    const model = getModel(0.7);
    expect(model).toBeDefined();
    expect(model.constructor.name).toBe('ChatGroq');
  });

  test('returns ChatGoogleGenerativeAI when provider is gemini', () => {
    process.env.AI_PROVIDER = 'gemini';
    process.env.GOOGLE_API_KEY = 'test-key';

    const model = getModel(0.7);
    expect(model).toBeDefined();
    expect(model.constructor.name).toBe('ChatGoogleGenerativeAI');
  });

  test('defaults to groq when no provider specified', () => {
    delete process.env.AI_PROVIDER;
    process.env.GROQ_API_KEY = 'test-key';

    const model = getModel();
    expect(model).toBeDefined();
    expect(model.constructor.name).toBe('ChatGroq');
  });
});
