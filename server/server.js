// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();

// tighten CORS to only your Vercel frontend + Railway preview URLs
const origins = [
  "https://feron-chat-live.vercel.app",
  "https://feron-chat-live-production.up.railway.app"
];

app.use(cors({
  origin: (incomingOrigin, cb) => {
    if (!incomingOrigin || origins.includes(incomingOrigin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// handle preflight
app.options("*", cors());

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/feron", async (req, res) => {
  try {
    const { messages } = req.body;
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are FERON, a Tier 1 machinist assistant for CNC operations…" },
        ...messages
      ],
      temperature: 0.7
    });
    res.json({ reply: chat.choices[0].message.content });
  } catch (err) {
    console.error("FERON API Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running on port ${PORT}`);
});
