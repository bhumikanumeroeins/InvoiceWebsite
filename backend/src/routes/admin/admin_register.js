import express from 'express';
import { registerAdmin, loginAdmin, getTotalInvoiceCount } from '../../controller/admin/admin_register.js';  

const router = express.Router() ;
router.post ( '/register' , registerAdmin ) ;
router.post ( '/login' , loginAdmin ) ;
router.get ( '/invoiceCount' , getTotalInvoiceCount ) ;

export default router ;

