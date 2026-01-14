import ItemMaster from "../../models/items/items.js";

export const createItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { description, quantity = 1, rate, tax = 0 } = req.body;

    if (!description || !rate) {
      return res.status(400).json({
        success: false,
        message: "description and rate are required"
      });
    }

    const amount = quantity * rate;

    const item = await ItemMaster.create({
      description,
      quantity,
      rate,
      amount,
      tax,
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      data: item
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getItems = async (req, res) => {
  const items = await ItemMaster.find({
    createdBy: req.user.userId
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: items
  });
};


export const deleteItem = async (req, res) => {
  const item = await ItemMaster.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.userId
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found"
    });
  }

  res.json({
    success: true,
    message: "Item deleted"
  });
};
