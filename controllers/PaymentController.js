// controllers/PaymentController.js
const PaymentService = require('../service/PaymentService');

class PaymentController {
  async createPayment(req, res) {
    try {
      const payment = await PaymentService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllPayments(req, res) {
    try {
      const payments = await PaymentService.getAllPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPaymentById(req, res) {
    try {
      const payment = await PaymentService.getPaymentById(req.params.id);
      if (!payment) return res.status(404).json({ error: "Payment not found" });
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePayment(req, res) {
    try {
      const payment = await PaymentService.updatePayment(req.params.id, req.body);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deletePayment(req, res) {
    try {
      await PaymentService.deletePayment(req.params.id);
      res.json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();
