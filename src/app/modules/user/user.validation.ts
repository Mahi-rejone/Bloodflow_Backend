import { z } from "zod";
import { UserRole, UserStatus } from "@prisma/client";

const userValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.nativeEnum(UserRole),
    status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
  }),
});

const userUpdateValidation = z.object({
  body: z.object({
    role: z.nativeEnum(UserRole).optional(),
    status: z.nativeEnum(UserStatus).optional(),
  }),
});

export const userValidation = {
  userValidationSchema,
  userUpdateValidation,
};
