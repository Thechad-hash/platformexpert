// server/server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

// Only allow requests from your Vercel frontend:
const ALLOWED_ORIGIN = 'https://feron-chat-live.vercel.app';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === ALLOWED_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error(`CORS block: origin ${origin} not allowed`));
    }
  }
}));

app.use(express.json());

// set up file uploads (Tier 1)
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
app.post('/api/feron', async (req, res) => {
  try {
    const { messages } = req.body;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are FERON, a Tier 1 machinist assistant for CNC operations...' },
        ...messages
      ],
      temperature: 0.7
    });

    res.json({ reply: chatResponse.choices[0].message.content });
  } catch (err) {
    console.error('FERON API Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // you can move/process the file here, e.g. rename or analyze it
  res.json({ filename: req.file.filename });
});

// Start server on dynamic port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running on port ${PORT}`);
});
