// server/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();

// Only allow your Vercel origin (and Railway preview URL if you like)
const allowedOrigins = [
  'https://feron-chat-live.vercel.app',
  // 'https://your-railway-preview.up.railway.app'    <-- if you ever preview on Railway
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. Postman) or if origin is in the list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'), false);
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/feron', async (req, res) => {
  try {
    const { messages } = req.body;
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are FERON, a Tier 1 machinist assistant…' },
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running on port ${PORT}`);
});
