import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './server/routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsing with generous limit for image upload in Crop Doctor
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'AgriN — BRICS AgrIn & Regenerative Agricultural Intelligence Network',
    time: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE !== 'false'
  });
});

// Mount REST API
app.use('/api', apiRouter);

async function startServer() {
  if (!isProduction) {
    // Development mode: attach Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT)
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: serve built static frontend
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🌾 AgriN Server running on http://0.0.0.0:${PORT}`);
    console.log(`🛰️ DEMO_MODE: ${process.env.DEMO_MODE !== 'false' ? 'ENABLED (Simulated Satellite, SMS, Weather)' : 'PRODUCTION'}`);
    console.log(`🤖 AI Engine: ${process.env.GEMINI_API_KEY ? 'Google GenAI Active' : 'Agro-Domain Contextual Engine'}`);
    console.log(`=======================================================`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
