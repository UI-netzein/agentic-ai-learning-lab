import {createAgent} from 'langchain'
import searchTool from '../tools/search.js'
import { calculatorTool } from '../tools/calculator.js'

const programmingAndCalculatorAgent = (model) => createAgent({
    model:model,
    tools:[searchTool,calculatorTool],
    systemPrompt:`You are a programming and calculator assitant

    Rules:
    1. Answer programming and software engineering questions.
    2. Use Tavily when current information is required.
    3. Do not invent external search results.
    4. Explain technical concepts clearly.
    5. Use calculator when you need to peform basic arithmetic operations such as add, subtract, divide and multiply.
    6. If a tool fails, acknowledge the limitation.
    `
    
})

export default programmingAndCalculatorAgent