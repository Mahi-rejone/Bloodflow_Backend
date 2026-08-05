import express from "express";
import { userController } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { userValidation } from "./user.validation.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/enums.js";
import { resendVerificationLimiter } from "../../middleware/rateLimiter.js";

const router = express.Router();
router.post(
  "/create-user",
  validation(userValidation.userValidationSchema),
  userController.createUser,
);
router.post(
  "/verify",
  validation(userValidation.verifyUserValidationSchema),
  userController.verifyUser,
);

router.post(
  "/resend-verification",
  resendVerificationLimiter,
  validation(userValidation.resendVerificationCodeValidationSchema),
  userController.resendVerificationCode,
);

router.get(
  "/get-me",
  auth(
    UserRole.ADMIN,
    UserRole.BLOOD_BANK_MANAGER,
    UserRole.HOSPITAL_REPRESENTATIVE,
    UserRole.USER,
  ),
  userController.getMe,
);

router.get("/donors", userController.getAllDonors);

router.get("/donors/:id", userController.getDonorById);

export const userRoute = router;
