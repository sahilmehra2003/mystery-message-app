import { z} from 'zod';

export const usernameValidation = z
  .string()
  .min(2, { error: "Username must be at least 2 characters" })
  .max(20, { error: "Username must not be more than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: "Username must not contain special characters",
  });


export const signUpSchema=z.object({
    username:usernameValidation,
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(6, { error: "Password must be at least 6 characters" })
})   