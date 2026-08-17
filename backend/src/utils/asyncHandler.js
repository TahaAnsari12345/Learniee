// Express 4 does not automatically forward rejected async route handlers.
export const asyncHandler = handler => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
