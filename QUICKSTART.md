# Quick Start Guide

## Setup (2 minutes)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Get a free API key:
   - **Groq** (recommended): https://console.groq.com
   - OR **Google AI**: https://aistudio.google.com/apikey

3. Create `.env.local` with your API key:

   **For Groq:**
   ```bash
   echo "AI_PROVIDER=groq" > .env.local
   echo "GROQ_API_KEY=your_key_here" >> .env.local
   ```

   **OR for Gemini:**
   ```bash
   echo "AI_PROVIDER=gemini" > .env.local
   echo "GOOGLE_API_KEY=your_key_here" >> .env.local
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Usage Flow

### Step 1: Create Your Palace
Describe a familiar space:
```
My apartment: living room with red leather couch and wooden coffee table,
kitchen with stainless steel fridge, bedroom with large oak dresser
```

Click "Generate My Palace"

### Step 2: Review Your Palace
The AI extracts rooms and objects. Review them, then click "Continue to Concept Mapping"

### Step 3: Map Your Learning Content
Paste what you want to learn:
```
Python is a high-level programming language.
Variables store data in memory.
Functions encapsulate reusable code blocks.
```

Click "Map to My Palace"

### Step 4: Explore in 3D
Navigate your memory palace! Green objects have concepts attached.
- Left click + drag: Rotate view
- Right click + drag: Pan
- Scroll: Zoom

## Testing

Run unit tests:
```bash
npm test
```

Run E2E tests (requires dev server running):
```bash
npm run test:e2e
```

## What's Working

✅ AI palace generation from descriptions
✅ Concept extraction and mapping
✅ Vivid mnemonic connections
✅ 3D visualization
✅ Full step-by-step flow
✅ Unit tests
✅ E2E tests

## Next Steps

- Try it with your own space
- Test with different learning content
- Explore the 3D palace
- Give feedback!
