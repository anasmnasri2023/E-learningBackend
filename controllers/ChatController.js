const ChatService = require("../service/ChatService");

class ChatController {
  static async sendMessage(req, res) {
    try {
      const { receiverId, message, messageType } = req.body;
      const senderId = req.user?.id || req.body.senderId;

      if (!receiverId || !message) {
        return res.status(400).json({
          success: false,
          message: "ID du destinataire et message requis"
        });
      }

      const newMessage = await ChatService.sendMessage(senderId, receiverId, message, messageType);

      res.status(201).json({
        success: true,
        message: "Message envoyé avec succès",
        data: newMessage
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const { otherUserId } = req.params;
      const currentUserId = req.user?.id || req.query.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      if (!otherUserId) {
        return res.status(400).json({
          success: false,
          message: "ID de l'autre utilisateur requis"
        });
      }

      const result = await ChatService.getMessagesBetweenUsers(currentUserId, otherUserId, page, limit);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getConversations(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;
      const conversations = await ChatService.getUserConversations(userId);

      res.status(200).json({ success: true, data: conversations });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { otherUserId } = req.params;
      const currentUserId = req.user?.id || req.body.userId;

      await ChatService.markMessagesAsRead(currentUserId, otherUserId);

      res.status(200).json({ success: true, message: "Messages marqués comme lus" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user?.id || req.body.userId;

      const result = await ChatService.deleteMessage(messageId, userId);

      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async searchUsers(req, res) {
    try {
      const { search } = req.query;
      const currentUserId = req.user?.id || req.query.userId;

      if (!search || search.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Terme de recherche requis (minimum 2 caractères)"
        });
      }

      const users = await ChatService.searchUsers(search.trim(), currentUserId);

      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUnreadCount(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;
      const count = await ChatService.getUnreadMessagesCount(userId);

      res.status(200).json({ success: true, data: { unreadCount: count } });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = ChatController;
