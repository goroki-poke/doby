import express from 'express';
import cors from 'cors';
import { validateInput } from './validators.js';
import { generateJsonLd } from './generate.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'JSON-LD Schema Generator API',
    version: '1.0.0',
    description: 'Generates Google-compliant JSON-LD structured data from raw input.',
    endpoints: {
      'POST /api/json-ld': 'Generate JSON-LD schema markup',
    },
    supportedTypes: ['article', 'product', 'organization', 'webpage', 'event', 'faq', 'auto'],
    docs: 'https://github.com/yourusername/jsonld-api',
  });
});

app.post('/api/json-ld', (req, res) => {
  try {
    const validation = validateInput(req.body);

    if (!validation.valid || !validation.data) {
      res.status(400).json({ error: validation.error || 'Invalid input data provided.' });
      return;
    }

    const jsonld = generateJsonLd(validation.type!, validation.data);
    res.json({ jsonld });
  } catch {
    res.status(400).json({ error: 'Invalid input data provided.' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.listen(PORT, () => {
  console.log(`JSON-LD API running on http://localhost:${PORT}`);
});

export default app;
