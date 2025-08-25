const ChatService = require("../service/ChatService");

class ChatController {
  static async sendMessage(req, res) {
    try {
      const { senderId, receiverId, message } = req.body;
      
      console.log("📤 Tentative d'envoi de message:", { senderId, receiverId, message });
      
      if (!senderId || !receiverId || !message) {
        return res.status(400).json({ 
          success: false, 
          message: "Champs manquants (senderId, receiverId, message requis)" 
        });
      }

      const newMessage = await ChatService.sendMessage(senderId, receiverId, message);
      
      console.log("✅ Message envoyé:", newMessage);
      
      res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
      console.error("❌ Erreur sendMessage:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const { userId1, userId2 } = req.params;
      
      console.log("📥 Récupération messages entre:", { userId1, userId2 });
      
      if (!userId1 || !userId2) {
        return res.status(400).json({ 
          success: false, 
          message: "Les deux IDs utilisateur sont requis" 
        });
      }

      const messages = await ChatService.getMessagesBetweenUsers(userId1, userId2);
      
      console.log(`✅ ${messages.length} messages récupérés`);
      
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error("❌ Erreur getMessages:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { receiverId, senderId } = req.body;
      
      if (!receiverId || !senderId) {
        return res.status(400).json({ 
          success: false, 
          message: "receiverId et senderId sont requis" 
        });
      }

      await ChatService.markMessagesAsRead(receiverId, senderId);
      res.status(200).json({ success: true, message: "Messages marqués comme lus" });
    } catch (error) {
      console.error("❌ Erreur markAsRead:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      
      if (!messageId) {
        return res.status(400).json({ 
          success: false, 
          message: "messageId est requis" 
        });
      }

      const deleted = await ChatService.deleteMessage(messageId);
      res.status(200).json({ success: true, data: deleted });
    } catch (error) {
      console.error("❌ Erreur deleteMessage:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = ChatController;