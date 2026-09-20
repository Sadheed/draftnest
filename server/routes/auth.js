// server/routes/auth.js

import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signupSchema, loginSchema } from '../validators/authSchemas.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), asyncHandler(signup));
router.post('/login', validate(loginSchema), asyncHandler(login));

export default router;