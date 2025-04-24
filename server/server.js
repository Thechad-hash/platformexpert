import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();

// enable CORS for your Vercel domain (or use '*' to allow everything)
app.use(
  cors({
    origin: 'https://feron-chat-live.vercel.app',
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type']
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
        { role: 'system', content: 'You are FERON…' },
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`FERON backend running on port ${PORT}`)
);
