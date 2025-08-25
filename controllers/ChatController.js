const ChatService = require("../service/ChatService");

class ChatController {
  static async sendMessage(req, res) {
    try {
      const { senderId, receiverId, message } = req.body;
      if (!senderId || !receiverId || !message) {
        return res.status(400).json({ success: false, message: "Champs manquants" });
      }

      const newMessage = await ChatService.sendMessage(senderId, receiverId, message);
      res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await ChatService.getMessagesBetweenUsers(userId1, userId2);
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { receiverId, senderId } = req.body;
      await ChatService.markMessagesAsRead(receiverId, senderId);
      res.status(200).json({ success: true, message: "Messages marqués comme lus" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const deleted = await ChatService.deleteMessage(messageId);
      res.status(200).json({ success: true, data: deleted });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = ChatController;
