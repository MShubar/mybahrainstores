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

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(32),
  newPassword: z.string().min(8),
});

export const emailVerificationSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(32),
});

export const accountDeletionSchema = z.object({
  confirmPhrase: z.literal("DELETE"),
});

export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetVerifyInput = z.infer<typeof passwordResetVerifySchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type AccountDeletionInput = z.infer<typeof accountDeletionSchema>;
