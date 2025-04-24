// server.js

// 1) Load .env
import dotenv from 'dotenv';
dotenv.config();

// 2) Imports
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

// 3) App init
const app = express();

// 4) CORS — allow all origins (for now)
app.use(cors());

// 5) JSON parsing
app.use(express.json());

// 6) OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 7) Chat endpoint
app.post('/api/feron', async (req, res) => {
  try {
    const { messages } = req.body;
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are FERON, a Tier 1 machinist assistant for CNC operations...' },
        ...messages,
      ],
      temperature: 0.7,
    });
    res.json({ reply: chat.choices[0].message.content });
  } catch (err) {
    console.error('FERON API Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 8) Start server on Railway’s PORT or 3001 locally
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`FERON backend running on port ${PORT}`));
