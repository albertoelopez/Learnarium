# Security & API Key Protection

## ✅ Your API Keys Are Secure

### Protection Measures in Place

1. **Environment Variables**
   - All API keys stored in `.env.local` (never committed to git)
   - `.env.local` is in `.gitignore` - cannot be accidentally committed
   - Keys only accessible server-side via `process.env`

2. **Server-Side Only**
   - AI chains (`generate-palace.ts`, `map-concepts.ts`) run in API routes
   - API routes are server-side only (Next.js App Router `/api/*`)
   - Client components (`PalaceCreator`, `ConceptMapper`) call APIs via fetch
   - Keys NEVER exposed to browser/client code

3. **No Hardcoded Secrets**
   - Zero API keys in source code
   - All providers use environment variables
   - Example file (`.env.example`) uses placeholders only

### Architecture Flow (Secure)

```
Browser (Client)
    ↓ POST /api/generate-palace
Next.js API Route (Server)
    ↓ Uses process.env.GROQ_API_KEY
LangChain → Groq API
    ↓
Response to client (palace JSON only)
```

**Client code NEVER sees API keys!**

---

## Provider Configuration

### Current Setup

```bash
# .env.local (protected by .gitignore)
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# Ollama (local backup - no API key needed)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gpt-oss
```

### Switch to Ollama (100% Offline)

For maximum privacy, use your local Ollama instance:

```bash
# Edit .env.local
AI_PROVIDER=ollama
OLLAMA_MODEL=gpt-oss
```

No API keys needed! All processing happens locally on your machine.

---

## Best Practices

### ✅ DO
- Keep `.env.local` in `.gitignore`
- Use different keys for dev/prod
- Rotate keys periodically
- Use Ollama for sensitive data

### ❌ DON'T
- Commit `.env.local` to git
- Share keys in screenshots/demos
- Use production keys in development
- Put keys in client-side code

---

## API Key Rotation

If you need to rotate keys:

1. **Groq:** https://console.groq.com/keys
2. **Google AI:** https://aistudio.google.com/apikey
3. Update `.env.local` with new keys
4. Restart dev server: `npm run dev`

---

## Git Safety Check

Verify your keys are protected:

```bash
# Should return .env*.local
cat .gitignore | grep env

# Should return nothing (keys not in code)
git grep "gsk_\|AIza"
```

---

## Ollama Setup (No Keys Required)

For 100% local, offline operation:

```bash
# 1. Install Ollama
# Visit: https://ollama.ai

# 2. Pull your model
ollama pull gpt-oss

# 3. Update .env.local
echo "AI_PROVIDER=ollama" >> .env.local

# 4. Restart
npm run dev
```

Now your memory palace data never leaves your machine!

---

## Security Checklist

- [x] API keys in `.env.local` (not committed)
- [x] `.env.local` in `.gitignore`
- [x] Keys only used server-side
- [x] No hardcoded secrets in code
- [x] Client uses API routes (not direct AI calls)
- [x] Ollama option available for offline use

**Your setup is secure! ✅**
