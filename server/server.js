// server.js

// 1) Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// 2) Core imports
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

// 3) Create Express app
const app = express();

// 4) CORS configuration
//    Replace with your actual Vercel front-end URL if different
const FRONTEND_ORIGIN = 'https://feron-chat-live.vercel.app';

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// 5) JSON body parsing
app.use(express.json());

// 6) OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 7) Your chat endpoint
app.post('/api/feron', async (req, res) => {
  try {
    const { messages } = req.body;
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are FERON, a Tier 1 machinist assistant for CNC operations...' },
        ...messages,
      ],
      temperature: 0.7,
    });
    res.json({ reply: chatResponse.choices[0].message.content });
  } catch (err) {
    console.error('FERON API Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 8) Start server on Railway / fallback to 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running on port ${PORT}`);
});
