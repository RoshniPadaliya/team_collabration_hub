// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, authUser, assignRole } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Private/Admin route
router.put('/assign-role', protect, authorize('Admin'), assignRole);

module.exports = router;
