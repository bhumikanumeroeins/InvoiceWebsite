import FAQ from "../../models/admin/faq.js";
import { createResult , createError } from '../../utils/utils.js' ;
import ContactUs from "../../models/users/contact_us.js";


/* ------------------ CREATE FAQ ------------------ */
export const createFAQ = async (req, res) => {
  try {
    const { question, answer, isActive } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json(createError("question and answer are required"));
    }

    // 🔥 Find highest existing order
    const lastFAQ = await FAQ.findOne().sort({ order: -1 });

    const nextOrder = lastFAQ ? lastFAQ.order + 1 : 1;

    const faq = await FAQ.create({
      question,
      answer,
      isActive: typeof isActive !== "undefined" ? isActive : true,
      order: nextOrder
    });

    return res
      .status(201)
      .json(createResult(faq, "FAQ created successfully"));

  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


/* ------------------ GET ALL FAQ (ADMIN) ------------------ */
export const getAllFAQsAdmin = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json(createResult(faqs, "FAQs fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

/* ------------------ UPDATE FAQ -----------------y- */
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await FAQ.findByIdAndUpdate(id, req.body, {
      new: true
    });

    if (!updated) {
      return res.status(404).json(createError("FAQ not found"));
    }

    return res.status(200).json(createResult(updated, "FAQ updated successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

/* ------------------ DELETE FAQ ------------------ */
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FAQ.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json(createError("FAQ not found"));
    }

    return res.status(200).json(createResult( "FAQ deleted successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


//get-list of contact us messages
export const getContactUsMessages = async (req, res) => {
  try {
    const messages = await ContactUs.find().sort({ createdAt: -1 });
    return res.status(200).json(createResult(messages, "Contact Us messages fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

//get contact us message by id
export const getContactUsMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactUs
      .findById(id);

    if (!message) {
      return res.status(404).json(createError("Message not found"));
    }
    return res.status(200).json(createResult(message, "Message fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

//delete contact us message by id
export const deleteContactUsMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactUs.findByIdAndDelete(id);  
    if (!deleted) {
      return res.status(404).json(createError("Message not found"));
    }

    return res.status(200).json(createResult("Message deleted successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};