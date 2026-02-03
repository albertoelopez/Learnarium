# AI Provider Configuration

Vizloci supports multiple AI providers so you're not locked into OpenAI.

## Supported Providers

### 1. Groq (Recommended)

**Why?** Lightning-fast inference, generous free tier, no credit card required.

**Models:**
- `llama-3.3-70b-versatile` (default)
- `mixtral-8x7b-32768`
- `gemma2-9b-it`

**Setup:**
```bash
AI_PROVIDER=groq
GROQ_API_KEY=your_key_from_console.groq.com
```

**Get your key:** https://console.groq.com

---

### 2. Google Gemini

**Why?** Powerful models, free tier available, Google's latest AI.

**Models:**
- `gemini-2.0-flash-exp` (default)
- `gemini-1.5-pro`
- `gemini-1.5-flash`

**Setup:**
```bash
AI_PROVIDER=gemini
GOOGLE_API_KEY=your_key_from_aistudio
```

**Get your key:** https://aistudio.google.com/apikey

---

### 3. Ollama (Local, Offline)

**Why?** Run completely offline on your machine, no API keys needed, 100% private.

**Models:**
- `gpt-oss` (or any model you have installed)
- `llama3`, `mistral`, `mixtral`, etc.

**Setup:**
```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gpt-oss
```

**Get started:**
1. Install Ollama: https://ollama.ai
2. Pull your model: `ollama pull gpt-oss`
3. Set `AI_PROVIDER=ollama` in `.env.local`

---

## Switching Providers

Just update your `.env.local`:

```bash
# Switch to Groq
AI_PROVIDER=groq
GROQ_API_KEY=gsk_xxxxx

# OR switch to Gemini
AI_PROVIDER=gemini
GOOGLE_API_KEY=AIzaSyxxxxxx
```

Restart your dev server and you're done!

## Performance Comparison

| Provider | Speed | Cost (Free Tier) | Quality | Privacy |
|----------|-------|------------------|---------|---------|
| Groq     | ⚡⚡⚡  | Generous         | Excellent | Cloud |
| Gemini   | ⚡⚡   | Good             | Excellent | Cloud |
| Ollama   | ⚡ (depends on GPU) | Free (local) | Good-Excellent | 100% Local |

## Architecture

The app uses a provider-agnostic approach via `src/lib/get-model.ts`:

```typescript
import { getModel } from '@/lib/get-model';

const model = getModel(0.7);
```

This returns the appropriate LangChain chat model based on your `AI_PROVIDER` env var.

## Adding New Providers

Want to add another provider? Just:

1. Install the LangChain integration (e.g., `@langchain/anthropic`)
2. Update `src/lib/get-model.ts`
3. Add docs here

Easy!
