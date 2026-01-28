import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true
    },
    name: {
        type: String,
        required: false
    },

    bussinessName: {
        type: String,
        required: false
    },
    password: {     
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: false
    },

    address: {
        type: String,
        required: false
    },

    websiteLink: {
        type: String,
        required: false 
    },

    totalInvoices: {
        type: Number,
        default: 0
    },

    paidInvoicesCount: {
        type: Number,
        default: 0
    },

    paidInvoicesAmount: {
        type: Number,
        default: 0
    },

    pendingInvoicesCount: {
        type: Number,
        default: 0
    },  

    pendingInvoicesAmount: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Registration = mongoose.model('Registration', registrationSchema);

// ✅ DEFAULT EXPORT
export default Registration;

