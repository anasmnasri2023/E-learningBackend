const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  bookingDate: { type: Date, required: true },
  status: { type: String, enum: ["en attente", "confirmé", "annulé"], default: "en attente" }
}, { timestamps: true });


const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;