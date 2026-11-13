import express from "express"

import { llm } from "../model.js";
import zod from "zod";
import programmingAndCalculatorAgent from "../agents/programmingExpertAgent.js";

const router = express.Router()

router.post('/ask-agent', async (req,res) => {
  const { question } = req.body;
  console.log("Inside ask agent")
  try {
    const model = llm.model
    const chain = llm.getPromptChain()
    // parse the incoming questions using zod shcmea
    const questionSchema = zod.object({
      technology: zod.string(),
      topic: zod.string(),
      level: zod.enum(["beginner", "intermediate", "advanced"]),
    });
    const extractedQuestion = model.withStructuredOutput(questionSchema);

    const questionObject = await extractedQuestion.invoke(question);
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
})

router.post('/chat', async (req,res) => {
  const { question } = req.body;
  console.log('insid chat',question)
  try {
    const model = llm.model

    const result = await programmingAndCalculatorAgent(model).invoke({
        messages:[
            {
                role:"human",
                content:question
            }
        ],
    },{
        recursionLimit:5
    })
    console.log({result})

    res.json({
      status: true,
      message: result.messages.at(-1).content,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message || "Unable to generate an interview answer.",
    });
  }
})



export default router
