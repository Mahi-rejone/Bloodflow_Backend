import { z } from "zod";

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    location: z.string().min(1),
    coverImage: z.string().optional(),
    eventDate: z.coerce.date(),
  }),
});

const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    coverImage: z.string().optional(),
    eventDate: z.coerce.date().optional(),
  }),
});

export const eventValidation = { createEventSchema, updateEventSchema };
