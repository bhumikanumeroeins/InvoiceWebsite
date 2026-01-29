import AdminRegister from '../../models/admin/admin_register.js' ;
import Invoice from "../../models/forms/invoiceTaxForm.js";
import bcrypt from 'bcryptjs' ;
import jwt from 'jsonwebtoken' ;
import { createResult , createError } from '../../utils/utils.js' ;
import Registration from '../../models/users/registration.js' ;

export const registerAdmin = async ( req , res ) => 
{
    const { email , password } = req.body ;
    try 
    {
        const existingAdmin = await AdminRegister.findOne ({ email } ) ;
        if ( existingAdmin ) 
        {
            return res.status ( 400 ).json ( { message : 'Admin already exists' } ) ;
        }       
        const hashedPassword = await bcrypt.hash ( password , 10 ) ;
        const newAdmin = new AdminRegister ( { email , password : hashedPassword } ) ;
        await newAdmin.save () ;
        res.status ( 201 ).json ( createResult ( { message : 'Admin registered successfully' } ) ) ;
    }   
    catch ( error )
    {
        res.status ( 500 ).json ( createError ( 'Server error' ) ) ;  
    }   
} ;

export const loginAdmin = async ( req , res ) => 
{
    try 
    {
        const { email , password } = req.body ;         
        if ( !email || !password )
        {
            return res.status ( 400 ).json ( { message : "Email and password required" } ) ;
        }   
        const admin = await AdminRegister.findOne ( { email } ) ;
        if ( !admin ) 
        {
            return res.status ( 400 ).json ( { message : "Invalid credentials" } ) ;
        }   

        const isMatch = await bcrypt.compare ( password , admin.password ) ;
        if ( !isMatch ) 
        {
            return res.status ( 400 ).json ( { message : "Invalid credentials" } ) ;
        }
        const token = jwt.sign (
            { adminId : admin._id } ,
            process.env.JWT_SECRET ,        

            { expiresIn : "1h" }
        ) ;       
        return res.status ( 200 ).json ( { token , email , adminId : admin._id } ) ;
    }       
    catch ( error )
    {
        console.error ( "LOGIN ERROR 👉" , error ) ;
        return res.status ( 500 ).json ( { message : error.message } ) ;
    }       
} ;


const parseDDMMYYYY = (dateStr, isEnd = false) => {
  if (!dateStr) return null;

  const [dd, mm, yyyy] = dateStr.split("-").map(Number);

  if (!dd || !mm || !yyyy) return null;

  // start date -> 00:00:00
  // end date -> 23:59:59
  if (isEnd) {
    return new Date(yyyy, mm - 1, dd, 23, 59, 59, 999);
  }
  return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
};


export const getTotalInvoiceCount = async (req, res) => {
  try {
    const {
      invoiceNo,
      clientName,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10
    } = req.query;

    const baseFilter = { isDeleted: false };
    const filter = { ...baseFilter };

    // 🔍 Invoice No filter
    if (invoiceNo) {
      filter["invoiceMeta.invoiceNo"] = {
        $regex: invoiceNo.trim(),
        $options: "i"
      };
    }

    // 👤 Client Name filter
    if (clientName) {
      filter["client.name"] = {
        $regex: clientName.trim(),
        $options: "i"
      };
    }

    // 📌 Status filter
    if (status && status !== "all") {
      filter.paymentStatus = status;
    }

    // 📅 Invoice Date filter (dd-mm-yyyy)
    if (dateFrom || dateTo) {
      filter["invoiceMeta.invoiceDate"] = {};

      if (dateFrom) {
        const fromDate = parseDDMMYYYY(dateFrom);
        if (fromDate) filter["invoiceMeta.invoiceDate"].$gte = fromDate;
      }

      if (dateTo) {
        const toDate = parseDDMMYYYY(dateTo, true);
        if (toDate) filter["invoiceMeta.invoiceDate"].$lte = toDate;
      }
    }


    // pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [invoices, filteredCount, totalInvoiceCount] = await Promise.all([
      Invoice.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "name email"),

      Invoice.countDocuments(filter),

      Invoice.countDocuments(baseFilter)
    ]);

    return res.status(200).json({
      success: true,
      totalInvoiceCount,
      filteredCount,
      currentPage: pageNum,
      totalPages: Math.ceil(filteredCount / limitNum),
      data: invoices
    });
  } catch (error) {
    console.error("getTotalInvoiceCount error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message
    });
  }
};




export const getRecentInvoices = async (req, res) => {
  try {
    const filter = { isDeleted: false };

    // ----------------------------
    // 📅 This month date range
    // ----------------------------
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // ----------------------------
    // 🔥 Overdue filter
    // overdue = dueDate < today AND not paid
    // ----------------------------
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ----------------------------
    // Recent invoices (last 10)
    // ----------------------------
    const recentInvoicesPromise = Invoice.find(filter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("createdBy", "name email");

    // ----------------------------
    // Dashboard Aggregation
    // ----------------------------
    const statsPromise = Invoice.aggregate([
      { $match: filter },

      {
        $facet: {
          // total invoices
          totalInvoices: [{ $count: "count" }],

          // unique clients
          totalClients: [
            {
              $group: {
                _id: {
                  $ifNull: ["$client.email", "$client.name"] // unique key
                }
              }
            },
            { $count: "count" }
          ],

          // this month revenue (based on paidAmount)
          thisMonthRevenue: [
            {
              $match: {
                "invoiceMeta.invoiceDate": {
                  $gte: startOfMonth,
                  $lte: endOfMonth
                }
              }
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: { $ifNull: ["$paidAmount", 0] } }
              }
            }
          ],

          // outstanding amount = sum(balanceDue) or grandTotal - paidAmount
          outstanding: [
            {
              $group: {
                _id: null,
                totalOutstanding: {
                  $sum: {
                    $cond: [
                      { $ifNull: ["$balanceDue", false] },
                      "$balanceDue",
                      {
                        $max: [
                          0,
                          {
                            $subtract: [
                              { $ifNull: ["$totals.grandTotal", 0] },
                              { $ifNull: ["$paidAmount", 0] }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                }
              }
            }
          ],

          // paid vs pending amounts
          paidPending: [
            {
              $group: {
                _id: null,
                totalGrandTotal: { $sum: { $ifNull: ["$totals.grandTotal", 0] } },
                totalPaid: { $sum: { $ifNull: ["$paidAmount", 0] } }
              }
            }
          ],

          // overdue invoices count
          overdueInvoices: [
            {
              $match: {
                "invoiceMeta.dueDate": { $lt: today },
                paymentStatus: { $ne: "paid" }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    const [recentInvoices, statsResult] = await Promise.all([
      recentInvoicesPromise,
      statsPromise
    ]);

    const stats = statsResult?.[0] || {};

    const totalInvoicesCount = stats.totalInvoices?.[0]?.count || 0;
    const totalClientsCount = stats.totalClients?.[0]?.count || 0;
    const thisMonthRevenue = stats.thisMonthRevenue?.[0]?.revenue || 0;
    const outstandingAmount = stats.outstanding?.[0]?.totalOutstanding || 0;
    const overdueInvoicesCount = stats.overdueInvoices?.[0]?.count || 0;

    const totalGrandTotal = stats.paidPending?.[0]?.totalGrandTotal || 0;
    const totalPaid = stats.paidPending?.[0]?.totalPaid || 0;
    const totalPending = Math.max(0, totalGrandTotal - totalPaid);

    const paidPercentage =
      totalGrandTotal > 0 ? Number(((totalPaid / totalGrandTotal) * 100).toFixed(2)) : 0;

    const pendingPercentage =
      totalGrandTotal > 0 ? Number(((totalPending / totalGrandTotal) * 100).toFixed(2)) : 0;

    return res.status(200).json({
      success: true,

      // 📌 stats
      stats: {
        totalInvoicesCount,
        totalClientsCount,
        thisMonthRevenue,
        outstandingAmount,
        overdueInvoicesCount,

        totalPaidAmount: totalPaid,
        totalPendingAmount: totalPending,

        paidPercentage,
        pendingPercentage
      },

      // 📌 recent invoices list
      recentInvoicesCount: recentInvoices.length,
      data: recentInvoices
    });
  } catch (error) {
    console.error("getRecentInvoices error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent invoices",
      error: error.message
    });
  }
};






export const getCustomersFromInvoices = async (req, res) => {
  try {
    const { search } = req.query;

    const matchStage = { isDeleted: false };

    // optional search by client name/email
    if (search) {
      matchStage.$or = [
        { "client.name": { $regex: search, $options: "i" } },
        { "client.email": { $regex: search, $options: "i" } }
      ];
    }

    const clients = await Invoice.aggregate([
      { $match: matchStage },

      // group by client email (best unique key)
      {
        $group: {
          _id: { $ifNull: ["$client.email", "$client.name"] },

          clientName: { $first: "$client.name" },
          clientEmail: { $first: "$client.email" },
          clientAddress: { $first: "$client.address" },
          clientCity: { $first: "$client.city" },
          clientState: { $first: "$client.state" },
          clientZip: { $first: "$client.zip" },

          totalInvoices: { $sum: 1 },

          totalGrandTotal: { $sum: { $ifNull: ["$totals.grandTotal", 0] } },
          totalPaidAmount: { $sum: { $ifNull: ["$paidAmount", 0] } },

          lastInvoiceDate: { $max: "$invoiceMeta.invoiceDate" }
        }
      },

      // compute pending
      {
        $addFields: {
          totalPendingAmount: {
            $max: [
              0,
              { $subtract: ["$totalGrandTotal", "$totalPaidAmount"] }
            ]
          }
        }
      },

      { $sort: { lastInvoiceDate: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      totalClients: clients.length,
      data: clients
    });
  } catch (error) {
    console.error("getClientsFromInvoices error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients"
    });
  }
};



export const getUsersList = async (req, res) => {
  try {
    const { email, name, search, page = 1, limit = 10 } = req.query;

    const filter = {};

    // ✅ filter by email
    if (email && email.trim()) {
      filter.email = { $regex: email.trim(), $options: "i" };
    }

    // ✅ filter by name
    if (name && name.trim()) {
      filter.name = { $regex: name.trim(), $options: "i" };
    }

    // ✅ optional: single search for both email + name
    if (search && search.trim()) {
      filter.$or = [
        { email: { $regex: search.trim(), $options: "i" } },
        { name: { $regex: search.trim(), $options: "i" } }
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [users, filteredCount, totalUsers] = await Promise.all([
      Registration.find(filter)
        .select("-password") // ❌ never send password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Registration.countDocuments(filter),
      Registration.countDocuments({})
    ]);

    return res.status(200).json({
      success: true,
      totalUsers,
      filteredCount,
      currentPage: pageNum,
      totalPages: Math.ceil(filteredCount / limitNum),
      data: users
    });
  } catch (error) {
    console.error("getUsersListAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};
