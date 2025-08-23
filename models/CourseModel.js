const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    language: { type: String, required: true },
    level: {
      type: String,
      enum: ["débutant", "intermédiaire", "avancé"],
      required: true,
    },
    duration: { type: Number, required: true }, // en heures
    price: { type: Number, required: true },

    // le prof responsable du cours
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["disponible", "réservé", "terminé"],
      default: "disponible",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
