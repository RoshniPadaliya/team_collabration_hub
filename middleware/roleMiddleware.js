// middleware/roleMiddleware.js
const asyncHandler = require('express-async-handler');

const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role '${req.user.role}' is not authorized`);
    }
    next();
  });
};

module.exports = { authorize };
