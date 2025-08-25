const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");

router.post("/send", ChatController.sendMessage);
router.get("/messages/:otherUserId", ChatController.getMessages);
router.put("/read/:otherUserId", ChatController.markAsRead);
router.delete("/message/:messageId", ChatController.deleteMessage);

router.get("/conversations", ChatController.getConversations);
router.get("/unread-count", ChatController.getUnreadCount);

router.get("/search-users", ChatController.searchUsers);

module.exports = router;
