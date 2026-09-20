import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid post ID');
const tags = z.array(z.string().trim().min(1).max(30)).max(10).default([]);

export const postIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().min(1).max(100000),
    tags,
  }),
});

export const updatePostSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().trim().min(1).max(100000).optional(),
    tags: tags.optional(),
  }).refine((body) => Object.keys(body).length > 0, 'At least one field is required'),
});