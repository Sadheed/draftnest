import { z } from 'zod';

const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());

export const signupSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    email,
    password: z.string().min(8).max(128),
  }),
});

export const loginSchema = z.object({
  body: z.object({ email, password: z.string().min(1).max(128) }),
});