import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOllama } from '@langchain/ollama';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export function getModel(temperature: number = 0.7): BaseChatModel {
  const provider = process.env.AI_PROVIDER || 'groq';

  if (provider === 'groq') {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set');
    }
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: 'llama-3.3-70b-versatile',
      temperature,
    });
  }

  if (provider === 'gemini') {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set');
    }
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: 'gemini-2.0-flash-exp',
      temperature,
    });
  }

  if (provider === 'ollama') {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const modelName = process.env.OLLAMA_MODEL || 'gpt-oss';

    return new ChatOllama({
      baseUrl,
      model: modelName,
      temperature,
    });
  }

  throw new Error(`Unknown AI provider: ${provider}`);
}
