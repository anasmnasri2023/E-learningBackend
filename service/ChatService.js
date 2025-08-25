const { Message, Conversation } = require("../models/Chat");
const User = require("../models/User");
const mongoose = require("mongoose");

class ChatService {
  // Envoyer un message
  static async sendMessage(senderId, receiverId, messageContent, messageType = "text") {
    try {
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (!sender || !receiver) {
        throw new Error("Utilisateur introuvable");
      }

      if (sender.isBlocked || receiver.isBlocked) {
        throw new Error("Impossible d'envoyer le message. Utilisateur bloqué");
      }

      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        message: messageContent,
        messageType,
      });

      const savedMessage = await newMessage.save();

      await savedMessage.populate([
        { path: 'sender', select: 'username email image_User' },
        { path: 'receiver', select: 'username email image_User' }
      ]);

      await this.updateConversation(senderId, receiverId, savedMessage._id);

      return savedMessage;
    } catch (error) {
      throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
    }
  }

  // Récupérer les messages entre deux utilisateurs
  static async getMessagesBetweenUsers(userId1, userId2, page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit;

      const messages = await Message.find({
        $and: [
          { $or: [
              { sender: userId1, receiver: userId2 },
              { sender: userId2, receiver: userId1 }
          ]},
          { isDeleted: false }
        ]
      })
        .populate('sender', 'username email image_User')
        .populate('receiver', 'username email image_User')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      await this.markMessagesAsRead(userId1, userId2);

      return {
        messages: messages.reverse(),
        pagination: {
          currentPage: page,
          totalMessages: await this.getMessagesCount(userId1, userId2),
          hasNextPage: messages.length === limit
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des messages: ${error.message}`);
    }
  }

  static async getMessagesCount(userId1, userId2) {
    return await Message.countDocuments({
      $and: [
        { $or: [
            { sender: userId1, receiver: userId2 },
            { sender: userId2, receiver: userId1 }
        ]},
        { isDeleted: false }
      ]
    });
  }

  static async markMessagesAsRead(currentUserId, otherUserId) {
    try {
      await Message.updateMany(
        { sender: otherUserId, receiver: currentUserId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );
    } catch (error) {
      throw new Error(`Erreur lors du marquage des messages: ${error.message}`);
    }
  }

  static async getUserConversations(userId) {
    try {
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: new mongoose.Types.ObjectId(userId) },
              { receiver: new mongoose.Types.ObjectId(userId) }
            ],
            isDeleted: false
          }
        },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
                then: "$receiver",
                else: "$sender"
              }
            },
            lastMessage: { $first: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  { $and: [
                      { $eq: ["$receiver", new mongoose.Types.ObjectId(userId)] },
                      { $eq: ["$isRead", false] }
                  ] },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "participant"
          }
        },
        { $unwind: "$participant" },
        {
          $project: {
            participant: {
              _id: "$participant._id",
              username: "$participant.username",
              email: "$participant.email",
              image_User: "$participant.image_User",
              statu: "$participant.statu"
            },
            lastMessage: "$lastMessage",
            unreadCount: 1,
            lastActivity: "$lastMessage.createdAt"
          }
        },
        { $sort: { lastActivity: -1 } }
      ]);

      return conversations;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des conversations: ${error.message}`);
    }
  }

  static async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findOne({ _id: messageId, sender: userId });

      if (!message) {
        throw new Error("Message introuvable ou non autorisé");
      }

      message.isDeleted = true;
      await message.save();

      return { success: true, message: "Message supprimé avec succès" };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  static async searchUsers(searchTerm, currentUserId) {
    try {
      const users = await User.find({
        $and: [
          { _id: { $ne: currentUserId } },
          { isDeleted: false },
          { isBlocked: false },
          { $or: [
              { username: { $regex: searchTerm, $options: 'i' } },
              { email: { $regex: searchTerm, $options: 'i' } }
          ]}
        ]
      })
        .select('username email image_User statu')
        .limit(20);

      return users;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }
  }

  static async updateConversation(userId1, userId2, messageId) {
    try {
      const participants = [userId1, userId2].sort();

      await Conversation.findOneAndUpdate(
        { participants: { $all: participants } },
        { participants, lastMessage: messageId, lastActivity: new Date(), isActive: true },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Erreur mise à jour conversation:', error);
    }
  }

  static async getUnreadMessagesCount(userId) {
    try {
      return await Message.countDocuments({
        receiver: userId,
        isRead: false,
        isDeleted: false
      });
    } catch (error) {
      throw new Error(`Erreur lors du comptage des messages non lus: ${error.message}`);
    }
  }
}

module.exports = ChatService;
