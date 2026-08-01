import express from "express";
import { userController } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { userValidation } from "./user.validation.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/enums.js";

const router = express.Router();
router.post(
  "/create-user",
  validation(userValidation.userValidationSchema),
  userController.createUser,
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
export const userRoute = router;
