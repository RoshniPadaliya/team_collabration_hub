
const express = require('express');
const router = express.Router();
const { getChatMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');


router.get('/:project', protect, getChatMessages);

module.exports = router;
