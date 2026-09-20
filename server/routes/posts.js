// server/routes/posts.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as postController from '../controllers/postController.js';
import { createPostSchema, postIdSchema, updatePostSchema } from '../validators/postSchemas.js';

const router = express.Router();

router.get('/', asyncHandler(postController.listPosts));
router.get('/:id', validate(postIdSchema), asyncHandler(postController.getPost));
router.post('/', protect, validate(createPostSchema), asyncHandler(postController.createPost));
router.put('/:id', protect, validate(updatePostSchema), asyncHandler(postController.updatePost));
router.delete('/:id', protect, validate(postIdSchema), asyncHandler(postController.deletePost));

export default router;