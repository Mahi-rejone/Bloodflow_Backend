import express from "express";
import { eventController } from "./event.controller";
import { validation } from "../../middleware/validation";
import { eventValidation } from "./event.validation";
import auth from "../../middleware/auth";
import { UserRole } from "../../../generated/client";

const router = express.Router();

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

router.post(
  "/create-event",
  auth(
    UserRole.ADMIN,
    UserRole.BLOOD_BANK_MANAGER,
    UserRole.HOSPITAL_REPRESENTATIVE,
  ),
  validation(eventValidation.createEventSchema),
  eventController.createEvent,
);
router.patch(
  "/:id",
  auth(
    UserRole.ADMIN,
    UserRole.BLOOD_BANK_MANAGER,
    UserRole.HOSPITAL_REPRESENTATIVE,
  ),
  validation(eventValidation.updateEventSchema),
  eventController.updateEvent,
);
router.delete(
  "/:id",
  auth(
    UserRole.ADMIN,
    UserRole.BLOOD_BANK_MANAGER,
    UserRole.HOSPITAL_REPRESENTATIVE,
  ),
  eventController.deleteEvent,
);

export const eventRoute = router;

