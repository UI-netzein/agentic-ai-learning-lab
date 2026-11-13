import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

class Model {
  constructor() {
    this.model = new ChatOllama({
      baseUrl: process.env.OLLAMA_URL,
      model: process.env.MODEL_NAME,
      temperature: 0,
    });
  }

  getPromptChain() {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are senior level {{technology}} interviwer 
     Rules:
    1. Answer only programming and software development questions.
    2. If the question is unrelated to programming, respond exactly:
       "I'm only a programming expert. Please ask a programming question."
    3. Do not answer unrelated questions.
    4. Explain programming concepts at the requested difficulty level.
    5. Provide practical code examples when appropriate.`,
      ],
      ["user", "Explain {topic} at {level} level."],
    ]);
    return prompt.pipe(this.model).pipe(new StringOutputParser());
  }
}

export const llm = new Model();
