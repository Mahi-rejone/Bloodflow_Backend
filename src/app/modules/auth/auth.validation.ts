import { z } from "zod";

const authValidationSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookie: z.object({
    refreshToken: z.string(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
  }),
});

const adminChangePasswordValidationSchema = z.object({
  body: z.object({
    email: z.string(),
    newPassword: z.string(),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string(),
    newPassword: z.string(),
  }),
});

export const authValidation = {
  authValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  adminChangePasswordValidationSchema,
  resetPasswordValidationSchema,
};
