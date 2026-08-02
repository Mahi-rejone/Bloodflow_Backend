import express from "express";

import { validation } from "../../middleware/validation.js";

import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/enums.js";
import { bloodRequestValidation } from "./blood.validation.js";
import { bloodController } from "./blood.controller.js";

const router = express.Router();

router.get("/pending", bloodController.BloodRequest);

router.get("/:id", bloodController.getBloodRequestById);

router.post(
  "/create-request",
  auth(
    UserRole.ADMIN,
    UserRole.BLOOD_BANK_MANAGER,
    UserRole.HOSPITAL_REPRESENTATIVE,
    UserRole.USER,
  ),
  validation(bloodRequestValidation.createBloodRequestSchema),
  bloodController.createBloodRequest,
);

export const bloodRequestRoute = router;
