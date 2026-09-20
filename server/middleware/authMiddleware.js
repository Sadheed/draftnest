// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      // 2. Extract token string (removes 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token using the secret key
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // 4. Attach the user ID to the request object (excluding the password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }

      return next(); // Move to the next middleware/controller function
    } catch (error) {
      return next(error);
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

export { protect };