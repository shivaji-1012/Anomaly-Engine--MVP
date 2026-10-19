import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check and environment capability
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    liveResearchAvailable: !!aiClient,
    timestamp: new Date().toISOString(),
    service: 'ANOMALY ENGINE — ATMOS 2026 Track C'
  });
});

// Live Research grounding endpoint using Gemini 3.8 Flash with Google Search
app.post('/api/research/grounding', async (req, res) => {
  const { query, company, sector, reportingPeriod } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!aiClient) {
    return res.json({
      live: false,
      message: 'GEMINI_API_KEY not configured or offline mode active. Using structured offline intelligence engine.',
      query,
      results: []
    });
  }

  try {
    const prompt = `You are the search grounding researcher for ANOMALY ENGINE (Consumer Retail & FMCG Intelligence Agent).
Investigate: "${query}"
Company: ${company || 'NIFTY 50 Consumer/Retail constituent'}
Sector: ${sector || 'FMCG / Retail'}
Reporting Period: ${reportingPeriod || 'Recent Quarters'}

Search for verified primary disclosures (quarterly financial results, investor presentations, BSE/NSE filings, earnings call transcripts, Nielsen/Kantar FMCG reports).
Provide:
1. Exact reported figures (Revenue, Volume Growth %, Operating Margin, Receivables, Inventory)
2. Direct quotes or excerpts from management disclosures
3. Competitor or category comparisons
4. Concrete URLs and publisher names where available

Ensure strict factual veracity. Do not invent numbers or cite non-existent reports.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const webChunks = groundingMetadata?.groundingChunks || [];
    const webSearchQueries = groundingMetadata?.webSearchQueries || [];

    res.json({
      live: true,
      text,
      webSearchQueries,
      groundingChunks: webChunks,
      searchEntryPoint: groundingMetadata?.searchEntryPoint?.renderedContent || null
    });
  } catch (error: any) {
    console.error('Error during Gemini search grounding:', error);
    res.status(500).json({
      error: 'Search grounding failed',
      details: error.message || String(error)
    });
  }
});

// Setup Vite middleware in dev or serve static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ANOMALY ENGINE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
