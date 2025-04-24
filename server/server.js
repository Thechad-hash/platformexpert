// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Import required modules
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

// Initialize Express app
const app = express();

// Allowed origin for your Vercel frontend
const FRONTEND_ORIGIN = 'https://feron-chat-live.vercel.app';

// 1) Enable CORS for preflight & actual requests
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
// 2) Handle all OPTIONS preflight requests
app.options('*', cors());

// 3) JSON body parsing
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the chat route
app.post('/api/feron', async (req, res) => {
  try {
    const { messages } = req.body;
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or "gpt-4"
      messages: [
        { role: 'system', content: 'You are FERON, a Tier 1 machinist assistant for CNC operations...' },
        ...messages,
      ],
      temperature: 0.7,
    });
    const reply = chatResponse.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('FERON API Error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server (Railway sets PORT, fallback to 3001 locally)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running on port ${PORT}`);
});
