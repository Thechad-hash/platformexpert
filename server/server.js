// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Import required modules
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

// Initialize Express app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the chat route
app.post("/api/feron", async (req, res) => {
  try {
    const { messages } = req.body;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4"
      messages: [
        { role: "system", content: "You are FERON, a Tier 1 machinist assistant for CNC operations..." },
        ...messages,
      ],
      temperature: 0.7,
    });

    const reply = chatResponse.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("FERON API Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server (PORT from Railway or fallback to 3001 locally)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running on port ${PORT}`);
});
