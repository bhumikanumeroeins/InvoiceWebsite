import Currency from "../../models/currency/currency.js";

/* ---------------- GET ALL ACTIVE CURRENCIES ---------------- */
export const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find({ isActive: true })
      .select('code name symbol locale')
      .sort({ sortOrder: 1, code: 1 });

    return res.status(200).json({
      success: true,
      count: currencies.length,
      data: currencies
    });

  } catch (error) {
    console.error("GET CURRENCIES ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------- GET CURRENCY BY CODE ---------------- */
export const getCurrencyByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const currency = await Currency.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    }).select('code name symbol locale');

    if (!currency) {
      return res.status(404).json({
        success: false,
        message: "Currency not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: currency
    });

  } catch (error) {
    console.error("GET CURRENCY BY CODE ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};