import {z} from "zod"

export const signInSchema=z.object({
    identifier:z.string(), // better name for email in production
    password:z.string()
})