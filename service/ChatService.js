const Message = require("../models/Chat");
const User = require("../models/userModel");

class ChatService {
  // ✅ Envoyer un message
  static async sendMessage(senderId, receiverId, messageContent) {
    try {
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (!sender || !receiver) {
        throw new Error("Utilisateur introuvable");
      }

      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message: messageContent,
      });

      // ✅ CORRECTION : Bien populer le nouveau message
      return await Message.findById(newMessage._id).populate([
        { path: "sender", select: "username email image_User" },
        { path: "receiver", select: "username email image_User" },
      ]);
    } catch (error) {
      throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
    }
  }

  // ✅ Récupérer tous les messages entre deux utilisateurs
  static async getMessagesBetweenUsers(userId1, userId2) {
    try {
      console.log(`🔍 Recherche messages entre ${userId1} et ${userId2}`);
      
      const messages = await Message.find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
      })
        .populate("sender", "username email image_User")
        .populate("receiver", "username email image_User")
        .sort({ createdAt: 1 });

      console.log(`📦 Messages trouvés: ${messages.length}`);
      console.log("Premier message:", messages[0] ? {
        id: messages[0]._id,
        sender: messages[0].sender,
        receiver: messages[0].receiver,
        message: messages[0].message
      } : "Aucun");

      return messages;
    } catch (error) {
      console.error("❌ Erreur dans getMessagesBetweenUsers:", error);
      throw new Error(`Erreur lors de la récupération des messages: ${error.message}`);
    }
  }

  // ✅ Marquer un message comme lu
  static async markMessageAsRead(messageId) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }
      );

      if (!message) {
        throw new Error("Message introuvable");
      }

      return message;
    } catch (error) {
      throw new Error(`Erreur lors du marquage comme lu: ${error.message}`);
    }
  }

  // ✅ AJOUT : Marquer plusieurs messages comme lus
  static async markMessagesAsRead(receiverId, senderId) {
    try {
      const result = await Message.updateMany(
        { receiver: receiverId, sender: senderId, isRead: false },
        { isRead: true }
      );
      return result;
    } catch (error) {
      throw new Error(`Erreur lors du marquage des messages comme lus: ${error.message}`);
    }
  }

  // ✅ AJOUT : Supprimer un message
  static async deleteMessage(messageId) {
    try {
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
        throw new Error("Message introuvable");
      }
      return message;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du message: ${error.message}`);
    }
  }

  // ✅ Compter les messages non lus d'un utilisateur
  static async getUnreadMessagesCount(userId) {
    try {
      return await Message.countDocuments({
        receiver: userId,
        isRead: false,
      });
    } catch (error) {
      throw new Error(`Erreur lors du comptage des messages non lus: ${error.message}`);
    }
  }
}

module.exports = ChatService;