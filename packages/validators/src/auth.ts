import { z } from "zod";
import { userRoleSchema } from "./common";

export const signInEmailSchema = z.object({
  email: z.string().email(),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120).optional(),
  role: userRoleSchema.default("customer"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
});

export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
