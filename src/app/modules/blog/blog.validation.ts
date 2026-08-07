import { z } from "zod";

const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    coverImage: z.string().optional(),
  }),
});

const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    coverImage: z.string().optional(),
  }),
});

export const blogValidation = { createBlogSchema, updateBlogSchema };
 