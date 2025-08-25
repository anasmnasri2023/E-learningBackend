const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");

router.post("/send", ChatController.sendMessage);
router.get("/messages/:userId1/:userId2", ChatController.getMessages);
router.put("/read", ChatController.markAsRead);
router.delete("/delete/:messageId", ChatController.deleteMessage);
router.get("/test/all", async (req, res) => {
  try {
    const Message = require("../models/Chat");
    const messages = await Message.find()
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;