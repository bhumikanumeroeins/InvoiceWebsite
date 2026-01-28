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




export const getTotalInvoiceCount = async (req, res) => {
  try {
    const {
      invoiceNo,
      clientName,
      status,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
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

    // 📅 Invoice Date filter
    if (dateFrom || dateTo) {
      filter["invoiceMeta.invoiceDate"] = {};

      if (dateFrom) {
        filter["invoiceMeta.invoiceDate"].$gte = new Date(dateFrom);
      }

      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter["invoiceMeta.invoiceDate"].$lte = endDate;
      }
    }

    // 💰 Amount filter
    if (amountMin || amountMax) {
      filter["totals.grandTotal"] = {};

      if (amountMin) filter["totals.grandTotal"].$gte = Number(amountMin);
      if (amountMax) filter["totals.grandTotal"].$lte = Number(amountMax);
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

    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .limit(10) // only 10 invoices
      .populate("createdBy", "name email"); // optional

    return res.status(200).json({
      success: true,
      total: invoices.length,
      data: invoices
    });
  } catch (error) {
    console.error("getRecentInvoices error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent invoices"
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
