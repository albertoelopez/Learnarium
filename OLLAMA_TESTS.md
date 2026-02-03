# Ollama Integration Tests

## Test Results ✅

### Unit Tests: 24/24 Passing

```bash
npm test
```

**New Ollama Tests:**
- ✅ Ollama Provider Configuration (5 tests)
- ✅ API Provider Switching (6 tests)

**Test Coverage:**
```
PASS src/__tests__/api-provider-switching.test.ts
PASS src/__tests__/ollama-integration.test.ts
PASS src/__tests__/PalaceEditor.test.tsx
PASS src/__tests__/ConceptMapper.test.tsx
PASS src/__tests__/PalaceCreator.test.tsx
PASS src/__tests__/palace-template.test.ts

Test Suites: 6 passed, 6 total
Tests:       24 passed, 24 total
```

---

## Ollama Connection Test ✅

```bash
npm run test:ollama
```

**Result:**
```
✅ Ollama is running!

Available models (13):
👉 1. gpt-oss:latest
   2. hf.co/mradermacher/MiroThinker-v1.5-30B-i1-GGUF:Q4_K_M
   3. olmo-3:7b-think
   ...

✅ Model "gpt-oss" is available!
```

---

## Test Details

### 1. Ollama Provider Configuration Tests

**Tests:**
- Validates ollama environment variables
- Uses default ollama values when not specified
- Provider can be switched between groq, gemini, and ollama
- Ollama can use custom base url
- Ollama can use different models

**What's Tested:**
- Environment variable configuration
- Default values (http://localhost:11434, gpt-oss)
- Provider switching
- Custom Ollama endpoints
- Multiple model support

---

### 2. API Provider Switching Tests

**Tests:**
- API routes respect AI_PROVIDER environment variable
- Validates required environment variables for each provider
- Ollama does not require API keys
- Ollama configuration is optional
- Can switch providers at runtime

**What's Tested:**
- Provider environment variable handling
- API key requirements (Groq/Gemini need keys, Ollama doesn't)
- Runtime provider switching
- Configuration validation

---

### 3. Ollama Connection Test Script

**Location:** `scripts/test-ollama.js`

**What it does:**
- Checks if Ollama is running
- Lists all available models
- Verifies target model (gpt-oss) is installed
- Provides setup instructions if model missing

**Usage:**
```bash
npm run test:ollama
```

---

## How to Use Ollama

### Quick Start

1. **Verify Ollama is running:**
   ```bash
   npm run test:ollama
   ```

2. **Switch to Ollama:**
   ```bash
   # Edit .env.local
   AI_PROVIDER=ollama
   ```

3. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Test in browser:**
   - Open http://localhost:3000
   - Create a palace
   - Watch it use your local gpt-oss model!

---

## Switching Between Providers

### Current (Groq - Fast & Free)
```bash
AI_PROVIDER=groq
GROQ_API_KEY=gsk_...
```

### Google Gemini (Backup)
```bash
AI_PROVIDER=gemini
GOOGLE_API_KEY=AIza...
```

### Ollama (100% Local)
```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gpt-oss
```

---

## Available Models on Your System

Your Ollama installation has these models ready:

1. **gpt-oss:latest** ✅ (Current target)
2. MiroThinker-v1.5-30B
3. olmo-3:7b-think
4. ministral-3:14b
5. DeepSeek-R1-Distill-Llama-8B
6. llama3.1:8b
7. Llama-2-13B-chat
8. qwen3-coder
9. nomic-embed-text
10. Phi-3.5-mini-instruct
11. Llama-3.2-3B-Instruct (2 variants)
12. llama3.2

To use a different model, update `.env.local`:
```bash
OLLAMA_MODEL=llama3.1:8b
```

---

## Performance Comparison

| Provider | Speed | Privacy | API Key Required | Internet Required |
|----------|-------|---------|------------------|-------------------|
| Groq     | ⚡⚡⚡   | Cloud   | ✅ Yes            | ✅ Yes             |
| Gemini   | ⚡⚡    | Cloud   | ✅ Yes            | ✅ Yes             |
| **Ollama** | ⚡ (GPU-dependent) | **100% Local** | ❌ No | ❌ No |

---

## Troubleshooting

### Ollama Not Running
```bash
# Start Ollama
ollama serve

# Or if using systemd
systemctl start ollama
```

### Model Not Found
```bash
# Pull the model
ollama pull gpt-oss

# Verify
ollama list
```

### Wrong Model Name
```bash
# Check available models
npm run test:ollama

# Update .env.local with exact model name
OLLAMA_MODEL=gpt-oss:latest
```

---

## Test Summary

✅ **All tests passing (24/24)**
✅ **Ollama connection verified**
✅ **Model gpt-oss available**
✅ **Provider switching functional**
✅ **No API keys needed for Ollama**

**Ready to use Ollama for 100% local, private memory palace generation!**
