import FAQ from "../../models/admin/faq.js";
import { createError, createResult } from "../../utils/utils.js";

export const getAllFAQsUser = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    return res.status(200).json(createResult(faqs, "FAQs fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};
