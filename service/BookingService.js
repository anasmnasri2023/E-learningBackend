// services/BookingService.js
const Booking = require('../models/BookingModel');

class BookingService {
  async createBooking(data) {
    return await Booking.create(data);
  }

  async getAllBookings() {
    return await Booking.find().populate('userId').populate('courseId');
  }

  async getBookingById(id) {
    return await Booking.findById(id).populate('userId').populate('courseId');
  }

  async updateBooking(id, data) {
    return await Booking.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBooking(id) {
    return await Booking.findByIdAndDelete(id);
  }
}

module.exports = new BookingService();
