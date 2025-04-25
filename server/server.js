// server/server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();

// Only allow requests from your Vercel frontend
app.use(
  cors({
    origin: 'https://feron-chat-live.vercel.app',
  })
);

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/feron', async (req, res) => {
  try {
    const { messages } = req.body;
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are FERON, a Tier 1 machinist assistant for CNC operations...',
        },
        ...messages,
      ],
      temperature: 0.7,
    });
    const reply = chatResponse.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('FERON API Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running on port ${PORT}`);
});
