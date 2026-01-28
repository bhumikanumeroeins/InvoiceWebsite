import express from 'express';
import { registerAdmin, loginAdmin, getTotalInvoiceCount, getRecentInvoices,getCustomersFromInvoices } from '../../controller/admin/admin_register.js';
import { authenticateAdmin } from '../../middleware/adminAuth.middleware.js' ;  

const router = express.Router() ;
router.post ( '/register' , registerAdmin ) ;
router.post ( '/login' , loginAdmin ) ;
router.get ( '/invoiceCount' , authenticateAdmin,    getTotalInvoiceCount ) ;
router.get ( '/recentInvoices' , authenticateAdmin,    getRecentInvoices ) ;
router.get ( '/customers' , authenticateAdmin,    getCustomersFromInvoices ) ;

export default router ;

