import {tool} from 'langchain'
import { calculatorSchema } from '../schema/calculatorSchema.js'

export const calculatorTool = tool(({a,b,op}) => {
    let result = "";
    switch  (op) {
        case "add":
            result = String(a + b);
            break;
        case "subtract":
            result = String(a - b);
            break;
        case "multiply":
            result = String(a * b);
            break;
        case "division":
            if(b === 0) {
                result = "division by zero is not supported"
                break
            }
            result = String(a / b)

    }
    return result
},
 {
    name:"calculator",
    description:"Perform addition, subtraction, division and multiplication on two numbers",
    schema: calculatorSchema
 }
)