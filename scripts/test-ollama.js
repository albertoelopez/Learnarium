#!/usr/bin/env node

const http = require('http');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gpt-oss';

console.log('🔍 Testing Ollama Connection...\n');
console.log(`Base URL: ${OLLAMA_BASE_URL}`);
console.log(`Model: ${OLLAMA_MODEL}\n`);

const url = new URL('/api/tags', OLLAMA_BASE_URL);

const req = http.get(url.toString(), (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);

      if (result.models && Array.isArray(result.models)) {
        console.log('✅ Ollama is running!');
        console.log(`\nAvailable models (${result.models.length}):`);

        result.models.forEach((model, idx) => {
          const modelName = model.name || model.model;
          const isTarget = modelName.includes(OLLAMA_MODEL);
          const marker = isTarget ? '👉' : '  ';
          console.log(`${marker} ${idx + 1}. ${modelName}`);
        });

        const hasTargetModel = result.models.some(m =>
          (m.name || m.model).includes(OLLAMA_MODEL)
        );

        if (hasTargetModel) {
          console.log(`\n✅ Model "${OLLAMA_MODEL}" is available!`);
          console.log('\nReady to use Ollama with Vizloci!');
          console.log('Set AI_PROVIDER=ollama in .env.local');
        } else {
          console.log(`\n⚠️  Model "${OLLAMA_MODEL}" not found.`);
          console.log(`\nTo install it, run:`);
          console.log(`  ollama pull ${OLLAMA_MODEL}`);
        }
      } else {
        console.log('⚠️  Unexpected response format');
        console.log(data);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Failed to connect to Ollama');
  console.error(`Error: ${error.message}\n`);
  console.log('Is Ollama running?');
  console.log('Start it with: ollama serve');
  console.log(`Or check if it's listening on ${OLLAMA_BASE_URL}`);
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.error('❌ Connection timeout');
  console.log('Ollama did not respond in 5 seconds');
  req.destroy();
  process.exit(1);
});
