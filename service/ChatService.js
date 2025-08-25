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

      return await newMessage.populate([
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
      const messages = await Message.find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
      })
        .populate("sender", "username email image_User")
        .populate("receiver", "username email image_User")
        .sort({ createdAt: 1 }); // ordre chronologique

      return messages;
    } catch (error) {
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

  // ✅ Compter les messages non lus d’un utilisateur
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
