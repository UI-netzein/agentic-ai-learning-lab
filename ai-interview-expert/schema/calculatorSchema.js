import z from "zod"

export const calculatorSchema = z.object({
    a: z.number(),
    b: z.number(),
    op: z.enum(["add","subtract","multiply","division"])
})