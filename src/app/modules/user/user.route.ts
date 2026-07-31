import express from "express";
import { userController } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { userValidation } from "./user.validation.js";

const router = express.Router();
router.post(
  "/create-user",
  validation(userValidation.userValidationSchema),
  userController.createUser,
);
export const userRoute = router;
