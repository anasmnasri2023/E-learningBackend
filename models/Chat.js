const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false, // utile pour savoir si le message est lu
    },
  },
  { timestamps: true } // ajoute automatiquement createdAt (date du message) et updatedAt
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
