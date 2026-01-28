import AdminRegister from '../../models/admin/admin_register.js' ;
import Invoice from "../../models/forms/invoiceTaxForm.js";
import bcrypt from 'bcryptjs' ;
import jwt from 'jsonwebtoken' ;
import { createResult , createError } from '../../utils/utils.js' ;

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
      invoiceNumber,
      customerId,
      status,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      templateId,
      page = 1,
      limit = 10
    } = req.query;

    // base filter (always)
    const baseFilter = { isDeleted: false };

    // dynamic filter for search
    const filter = { ...baseFilter };

    // 🔍 Invoice Number search
    if (invoiceNumber) {
      filter.invoiceNumber = { $regex: invoiceNumber.trim(), $options: "i" };
    }

    // 👤 Customer filter
    if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
      filter.customerId = customerId;
    }

    // 📌 Status filter
    if (status && status !== "all") {
      filter.paymentStatus = status; // change key if needed
    }

    // 📄 Template filter
    if (templateId && mongoose.Types.ObjectId.isValid(templateId)) {
      filter.templateId = templateId;
    }

    // 📅 Date filter
    if (dateFrom || dateTo) {
      filter.issueDate = {}; // change if your schema uses invoiceMeta.issueDate

      if (dateFrom) filter.issueDate.$gte = new Date(dateFrom);

      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter.issueDate.$lte = endDate;
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

      // count based on applied filters
      Invoice.countDocuments(filter),

      // count of ALL invoices (without filters)
      Invoice.countDocuments(baseFilter)
    ]);

    return res.status(200).json({
      success: true,

      // total invoices in DB (all)
      totalInvoiceCount,

      // total invoices after applying filters
      filteredCount,

      currentPage: pageNum,
      totalPages: Math.ceil(filteredCount / limitNum),

      data: invoices
    });
  } catch (error) {
    console.error("getTotalInvoiceCount error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices"
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
