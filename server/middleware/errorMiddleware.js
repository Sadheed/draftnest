// Middleware for handling non-existent route requests (404)
export const unknownEndpoint = (req, res, next) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.method} ${req.originalUrl} not found` });
};

// Global Centralized Error Handler
export const errorHandler = (error, req, res, next) => {
  console.error(`[Error] ${error.name}: ${error.message}`);

  // 1. Invalid MongoDB ObjectId (e.g., passing "123" instead of a 24-char hex string)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // 2. Duplicate Key Error (e.g., trying to register an email/username that already exists)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `A record with that ${field} already exists.`
    });
  }

  // 3. Mongoose Schema Validation Error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  // 4. JWT Token Errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // Fallback 500 Server Error
  res.status(error.statusCode || error.status || 500).json({
    success: false,
    message: error.statusCode || error.status ? error.message : 'Internal Server Error',
    ...(error.code ? { code: error.code } : {}),
  });
};