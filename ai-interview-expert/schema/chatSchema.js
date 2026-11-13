import z from "zod"

export const chatSchema = z.object({
    question:z.string().max(1000, {
        error:"questions should be under 1000 characters"
    })
})

