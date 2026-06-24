// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract token string (removes 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the user ID to the request object (excluding the password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware/controller function
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };