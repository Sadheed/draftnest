export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (validated.body) req.body = validated.body;
    next(); // Data is valid, pass control to the controller
  } catch (error) {
    // Format Zod errors into clean, readable strings
    const errorMessages = error.issues?.map((issue) => `${issue.path.join('.')}: ${issue.message}`) || [];
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
};