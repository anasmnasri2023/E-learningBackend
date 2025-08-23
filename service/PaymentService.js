// services/PaymentService.js
const Payment = require('../models/PaymentModel');

class PaymentService {
  async createPayment(data) {
    return await Payment.create(data);
  }

  async getAllPayments() {
    return await Payment.find().populate('userId').populate('courseId');
  }

  async getPaymentById(id) {
    return await Payment.findById(id).populate('userId').populate('courseId');
  }

  async updatePayment(id, data) {
    return await Payment.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePayment(id) {
    return await Payment.findByIdAndDelete(id);
  }
}

module.exports = new PaymentService();
