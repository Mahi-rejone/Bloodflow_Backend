import express from "express";
import { validation } from "../../middleware/validation.js";
import { authValidation } from "./auth.validation.js";
import { authController } from "./auth.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.post(
  "/login",
  validation(authValidation.authValidationSchema),
  authController.UserLogin,
);
router.post(
  "/refresh-token",
  validation(authValidation.refreshTokenValidationSchema),
  authController.refreshToken,
);
router.post(
  "/change-password",
  auth(
    UserRole.ADMIN,
    UserRole.BLOOD_BANK_MANAGER,
    UserRole.HOSPITAL_REPRESENTATIVE,
    UserRole.DONOR_RECIPIENT,
  ),
  validation(authValidation.changePasswordValidationSchema),
  authController.changePassword,
);
export const authRoute = router;
