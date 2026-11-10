import "dotenv/config";

import { TavilySearch } from "@langchain/tavily";
import {ChatOllama} from '@langchain/ollama'
// import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// 1. Recreate __dirname (Required in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to automatically serve everything inside the 'public' folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const models = {
  'grok':new ChatGroq({
  apiKey: process.env.GROK_API_KEY,
  model: "qwen/qwen3-32b",
  temperature: 0,
}),
  'ollama':new ChatOllama({
  model: "qwen2.5:3b",
  baseUrl:"http://127.0.0.1:11434",
  temperature: 0,
})
}


const searchTool = new TavilySearch({
  maxResults: 3,
  searchDepth: "basic",
});

const agent = createAgent({
  model:models.ollama,
  tools: [searchTool],
  systemPrompt: ` You are a helpful AI research assistant.

    Use Tavily when the user asks for current information.

    Base your answers on search results.
    Include source links when available.
    Do not invent information.`,
});

app.post("/ask-agent", async (req, res) => {
  try {
    const prompt = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!prompt) {
      return res.status(400).json({
        status: false,
        message: "Please provide a message to send to the agent.",
      });
    }

    console.log("Invoking Agent");
    const response = await agent.invoke({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const messages = response?.messages ?? [];
    const finalMessage = messages[messages.length - 1];
    const content = finalMessage?.content;
    const answer = Array.isArray(content)
      ? content.map((part) => (typeof part === "string" ? part : part?.text || "")).join("")
      : content;

    return res.json({
      status: true,
      message: typeof answer === "string" ? answer : JSON.stringify(answer ?? response),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error?.message || "Something went wrong while contacting the agent.",
    });
  }
});

const port = process.env.PORT || 3000;

const server = app.listen(port);

server.once("listening", () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the other process or change PORT in .env.`);
  } else {
    console.error("Server failed to start:", error);
  }
  process.exitCode = 1;
});
