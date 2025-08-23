// routes/paymentRouter.js
const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.post('/', PaymentController.createPayment);
router.get('/', PaymentController.getAllPayments);
router.get('/:id', PaymentController.getPaymentById);
router.put('/:id', PaymentController.updatePayment);
router.delete('/:id', PaymentController.deletePayment);

module.exports = router;
