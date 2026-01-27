import Registration from '../../models/users/registration.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createResult, createError } from '../../utils/utils.js';


export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Registration.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Registration({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(createResult({ message: 'User registered successfully' }));
    } catch (error) {
        res.status(500).json(createError('Server error'));  
    }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await Registration.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token, email, userId: user._id });
  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    return res.status(500).json({ message: error.message });
  }
};
;


export const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { name, bussinessName } = req.body;

    try {
        const user = await Registration.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.name = name || user.name;
        user.bussinessName = bussinessName || user.bussinessName; 
        await user.save();
        res.status(200).json(createResult({ message: 'Profile updated successfully' }));
    } catch (error) {
        res.status(500).json(createError('Server error'));
    }
};


export const changePassword = async (req, res) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;    
    try {
        const user = await Registration.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        } 
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json(createResult({ message: 'Password changed successfully' }));
    }
    catch (error) {
        res.status(500).json(createError('Server error'));  
    }
};  