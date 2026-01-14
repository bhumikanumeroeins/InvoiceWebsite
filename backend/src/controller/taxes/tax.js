import Tax from "../../models/taxes/tax.js";

export const createTax = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, rate, isCompound } = req.body;

    if (!name || rate === undefined) {
      return res.status(400).json({
        success: false,
        message: "Tax name and rate are required"
      });
    }

    const tax = await Tax.create({
      name,
      rate,
      isCompound: !!isCompound,
      createdBy: userId
    });

    return res.status(201).json({
      success: true,
      message: "Tax created successfully",
      data: tax
    });

  } catch (error) {
    console.error("CREATE TAX ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const deleteTax = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { taxId } = req.params;

    const tax = await Tax.findOneAndDelete({
      _id: taxId,
      createdBy: userId
    });

    if (!tax) {
      return res.status(404).json({
        success: false,
        message: "Tax not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tax deleted successfully"
    });

  } catch (error) {
    console.error("DELETE TAX ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getAllTaxes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const taxes = await Tax.find({ createdBy: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: taxes.length,
      data: taxes
    });

  } catch (error) {
    console.error("GET TAXES ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
