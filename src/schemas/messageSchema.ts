import {z} from "zod"

export const messageSchema=z.object({
    content:z
           .string()
           .min(5,{error:"Message must be minimum of 5 characters"})
           .max(300,{error:"Content must be no longer than 300 characters"})
})