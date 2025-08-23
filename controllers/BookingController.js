// controllers/BookingController.js
const BookingService = require('../service/BookingService');

class BookingController {
  async createBooking(req, res) {
    try {
      const booking = await BookingService.createBooking(req.body);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllBookings(req, res) {
    try {
      const bookings = await BookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBooking(req, res) {
    try {
      const booking = await BookingService.updateBooking(req.params.id, req.body);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteBooking(req, res) {
    try {
      await BookingService.deleteBooking(req.params.id);
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new BookingController();
