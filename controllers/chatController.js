
const asyncHandler = require('express-async-handler');
const ChatMessage = require('../models/ChatMessage');

// @desc    Get chat messages for a project

const getChatMessages = asyncHandler(async (req, res) => {
  const { project } = req.params;
  const messages = await ChatMessage.find({ project }).populate('sender', 'name email');
  res.json(messages);
});



module.exports = { getChatMessages };
