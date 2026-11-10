import express from "express";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import { chain, model } from "./model.js";
import zod from "zod";
import { stat } from "fs";

// 1. Recreate __dirname (Required in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to automatically serve everything inside the 'public' folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/ask-agent", async (req, res) => {
  const { question } = req.body;
  try {
    // parse the incoming questions using zod shcmea
    const questionSchema = zod.object({
      language: zod.string(),
      topic: zod.string(),
      level: zod.enum(["beginner", "intermediate", "advanced"]),
    });
    const extractedQuestion = model.withStructuredOutput(questionSchema);

    const questionObject = await extractedQuestion.invoke(question);
    console.log({questionObject})
    const answer = await chain.invoke(questionObject);
    res.json({
      status: true,
      message: answer,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message || "Unable to generate an interview answer.",
    });
  }
});

app.listen(process.env.PORT, async () => {
  console.log("App running on port", process.env.PORT);
});

process.on("SIGINT", (signal) => {
  process.exit(1);
});
