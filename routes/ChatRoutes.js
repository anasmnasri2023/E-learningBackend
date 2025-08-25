const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");

router.post("/send", ChatController.sendMessage);
router.get("/messages/:userId1/:userId2", ChatController.getMessages);
router.put("/read", ChatController.markAsRead);
router.delete("/delete/:messageId", ChatController.deleteMessage);

module.exports = router;
