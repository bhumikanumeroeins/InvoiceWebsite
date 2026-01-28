import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentStatus :{
        type: String,
        enum: ['paid', 'partiallyPaid', 'unpaid']
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    paidDate: Date,
    paymentMethod: { enum: ['cash', 'check','creditCard', 'debitCard', 'bankTransfer', 'upi', 'other'] },
    paymentNote: String
});   

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;