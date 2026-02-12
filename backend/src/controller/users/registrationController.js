import Registration from '../../models/users/registration.js';
import ContactUs from '../../models/users/contact_us.js'; 
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


export const getProfile = async (req, res) => {
  try {
    /* ---------------- AUTH CHECK ---------------- */
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = req.user.userId;

    /* ---------------- FIND USER ---------------- */
    const user = await Registration.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        email: user.email,
        name: user.name || '',
        bussinessName: user.bussinessName || '',
        phone: user.phone || '',
        address: user.address || '',
        websiteLink: user.websiteLink || ''
      }
    });

  } catch (error) {
    console.error("GET PROFILE ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    /* ---------------- AUTH CHECK ---------------- */
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = req.user.userId;
    const { name, bussinessName, phone, address, websiteLink } = req.body;

    /* ---------------- FIND USER ---------------- */
    const user = await Registration.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* ---------------- UPDATE FIELDS ---------------- */
    if (name !== undefined) user.name = name;
    if (bussinessName !== undefined) user.bussinessName = bussinessName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (websiteLink !== undefined) user.websiteLink = websiteLink;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const changePassword = async (req, res) => {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = req.user.userId;
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


// post api for contact us form
export const contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = new ContactUs({ name, email, message });
        await newContact.save();
        res.status(201).json(createResult({ message: 'Contact message sent successfully' }));
    }
    catch (error) {
        res.status(500).json(createError('Server error'));  
    }
};  


// Get email report frequency
export const getEmailReportFrequency = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await Registration.findById(req.user.userId).select('emailReportFrequency');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        emailReportFrequency: user.emailReportFrequency || 'never'
      }
    });

  } catch (error) {
    console.error("GET EMAIL REPORT FREQUENCY ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Update email report frequency
export const updateEmailReportFrequency = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { emailReportFrequency } = req.body;

    // Validate frequency value
    if (!['weekly', 'monthly', 'never'].includes(emailReportFrequency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid frequency. Must be 'weekly', 'monthly', or 'never'"
      });
    }

    const user = await Registration.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.emailReportFrequency = emailReportFrequency;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email report frequency updated successfully",
      data: {
        emailReportFrequency: user.emailReportFrequency
      }
    });

  } catch (error) {
    console.error("UPDATE EMAIL REPORT FREQUENCY ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};  



// upgrade subscription ----->

export const upgradeSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { plan } = req.body;

    const user = await Registration.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let invoiceLimit = 2;
    let price ;
    let months ;

    if (plan === "monthly") {
      invoiceLimit = -1; // unlimited
      price = "$3";
      months = 1;
    } else if (plan === "halfYearly") {
      invoiceLimit = -1;
      price = "$15";
      months = 6;
    } else if (plan === "yearly") {
      invoiceLimit = -1;
      price = "$25";
      months = 12;
    } else {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    user.subscription = {
      planName: plan,
      price,
      invoiceLimit,
      startDate,
      endDate,
      isActive: true
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription upgraded successfully",
      subscription: user.subscription
    });

  } catch (error) {
    res.status(500).json({ message: "Error upgrading plan" });
  }
};