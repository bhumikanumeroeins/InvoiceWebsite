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

    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Registration = mongoose.model('Registration', registrationSchema);

// ✅ DEFAULT EXPORT
export default Registration;

