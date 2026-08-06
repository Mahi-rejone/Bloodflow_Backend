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
const acceptDonationSchema = z.object({
  body: z.object({
    units: z
      .number({ error: "Units is required" })
      .int()
      .positive("Units must be a positive number"),
  }),
});

export const bloodRequestValidation = {
  createBloodRequestSchema,
  acceptDonationSchema,
};
