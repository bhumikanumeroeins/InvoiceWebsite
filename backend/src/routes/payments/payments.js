import express from 'express';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { updatePaymentStatus, getPaymentDetails } from '../../controller/payments/payments.js';

const router = express.Router();

// All payment routes require authentication
router.use(authenticateUser);

// Update payment status for an invoice
router.put('/:invoiceId', updatePaymentStatus);

// Get payment details for an invoice
router.get('/:invoiceId', getPaymentDetails);

export default router;