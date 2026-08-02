import { z } from "zod";
import { BloodGroup } from "../../../generated/browser";

const createBloodRequestSchema = z.object({
  body: z.object({
    bloodGroup: z.enum(BloodGroup),
    unitsNeeded: z.number().int().positive(),
    hospital: z.string().min(1),
    state: z.string().min(1),
    district: z.string().min(1),
    town: z.string().min(1),
    address: z.string().min(1),
    neededAt: z.coerce.date(),
  }),
});

export const bloodRequestValidation = {
  createBloodRequestSchema,
};