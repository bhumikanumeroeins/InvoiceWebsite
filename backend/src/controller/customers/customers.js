import InvoiceTaxForm from "../../models/forms/invoiceTaxForm.js";
import mongoose from "mongoose";


export const getCustomersList = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await InvoiceTaxForm.aggregate([
      /* ---------------- MATCH USER + NOT DELETED ---------------- */
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          isDeleted: false
        }
      },

      /* ---------------- GROUP BY CLIENT NAME ---------------- */
      {
        $group: {
          _id: "$client.name",

          client: { $first: "$client" },

          documents: { $sum: 1 },

          paidAmount: { $sum: "$paidAmount" },

          grandTotal: { $sum: "$totals.grandTotal" },

          paymentStatuses: { $addToSet: "$paymentStatus" }
        }
      },

      /* ---------------- DERIVE PAYMENT STATUS ---------------- */
      {
        $addFields: {
          paymentStatus: {
            $cond: [
              { $in: ["overdue", "$paymentStatuses"] },
              "overdue",
              {
                $cond: [
                  { $in: ["partiallyPaid", "$paymentStatuses"] },
                  "partiallyPaid",
                  {
                    $cond: [
                      { $in: ["unpaid", "$paymentStatuses"] },
                      "unpaid",
                      "paid"
                    ]
                  }
                ]
              }
            ]
          }
        }
      },

      /* ---------------- SHAPE CUSTOMER ROW ---------------- */
      {
        $project: {
          _id: 0,
          client: 1,
          documents: 1,
          paymentStatus: 1,
          paidAmount: 1,
          totals: {
            grandTotal: "$grandTotal"
          }
        }
      },

      /* ---------------- SORT ---------------- */
      {
        $sort: { "client.name": 1 }
      },

      /* ---------------- FINAL GROUP (SUMMARY) ---------------- */
      {
        $group: {
          _id: null,
          customers: { $push: "$$ROOT" },

          totalAmount: { $sum: "$totals.grandTotal" },

          totalPaidAmount: { $sum: "$paidAmount" }
        }
      },

      /* ---------------- BALANCE CALC ---------------- */
      {
        $addFields: {
          balanceDue: {
            $subtract: ["$totalAmount", "$totalPaidAmount"]
          }
        }
      },

      /* ---------------- FINAL RESPONSE ---------------- */
      {
        $project: {
          _id: 0,
          customers: 1,
          summary: {
            totalAmount: "$totalAmount",
            paidAmount: "$totalPaidAmount",
            balanceDue: "$balanceDue"
          }
        }
      }
    ]);

    const data = result[0] || {
      customers: [],
      summary: {
        totalAmount: 0,
        paidAmount: 0,
        balanceDue: 0
      }
    };

    return res.status(200).json({
      success: true,
      count: data.customers.length,
      data: data.customers,
      summary: data.summary
    });

  } catch (error) {
    console.error("CUSTOMER LIST ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getInvoicesByClientName = async (req, res) => {
  try {
    const userId = req.user.userId;
    const clientName = decodeURIComponent(req.params.name);

    if (!clientName) {
      return res.status(400).json({
        success: false,
        message: "Client name is required"
      });
    }

    /* ---------------- FETCH INVOICES ---------------- */
    const invoices = await InvoiceTaxForm.find({
      createdBy: userId,
      "client.name": clientName,
      isDeleted: false
    }).sort({ createdAt: -1 });

    /* ---------------- CALCULATIONS ---------------- */
    let totalAmount = 0;
    let totalPaidAmount = 0;

    invoices.forEach(inv => {
      totalAmount += inv.totals?.grandTotal || 0;
      totalPaidAmount += inv.paidAmount || 0;
    });

    const remainingAmount = totalAmount - totalPaidAmount;

    /* ---------------- RESPONSE ---------------- */
    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
      summary: {
        totalAmount,
        totalPaidAmount,
        remainingAmount
      }
    });

  } catch (error) {
    console.error("GET CLIENT INVOICES ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
