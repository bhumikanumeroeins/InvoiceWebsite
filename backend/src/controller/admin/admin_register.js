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
    const filter = { isDeleted: false };

    const [invoices, totalCount] = await Promise.all([
      Invoice.find(filter)
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email"), // optional
      Invoice.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      totalCount,
      data: invoices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices"
    });
  }
};


