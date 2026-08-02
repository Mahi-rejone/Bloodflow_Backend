import { z } from "zod";
import { UserRole, UserStatus } from "../../../generated/enums";

const userValidationSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(100),
    email: z.email({ message: "Invalid email" }),
    password: z.string().min(6).max(100),
    role: z.enum(UserRole),
    status: z.enum(UserStatus).default(UserStatus.ACTIVE),
  }),
});

const userUpdateValidation = z.object({
  body: z.object({
    role: z.enum(UserRole).optional(),
    status: z.enum(UserStatus).optional(),
  }),
});

const verifyUserValidationSchema = z.object({
  body: z.object({
    email: z.email({ message: "Invalid email" }),
    verifyCode: z.string().length(6, { message: "Code must be 6 digits" }),
  }),
});

export const resendVerificationCodeValidationSchema = z.object({
  body: z.object({
    email: z.email({ message: "Invalid email" }),
  }),
});

export const userValidation = {
  userValidationSchema,
  userUpdateValidation,
  verifyUserValidationSchema,
  resendVerificationCodeValidationSchema,
};
