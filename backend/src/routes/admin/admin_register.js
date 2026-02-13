import express from 'express';
import { registerAdmin, loginAdmin, getTotalInvoiceCount, getRecentInvoices,getCustomersFromInvoices, getUsersList, createPlan, getAllPlans, updatePlan, togglePlanStatus, getAllSubscribers } from '../../controller/admin/admin_register.js';
import { authenticateAdmin } from '../../middleware/adminAuth.middleware.js' ;  

const router = express.Router() ;
router.post ( '/register' , registerAdmin ) ;
router.post ( '/login' , loginAdmin ) ;
router.get ( '/invoiceCount' , authenticateAdmin,    getTotalInvoiceCount ) ;
router.get ( '/recentInvoices' , authenticateAdmin,    getRecentInvoices ) ;
router.get ( '/customers' , authenticateAdmin,    getCustomersFromInvoices ) ;
router.get ( '/users-list' , authenticateAdmin,    getUsersList ) ;
router.post('/add-plan', authenticateAdmin, createPlan);
router.get('/get-plans', authenticateAdmin, getAllPlans)

router.put("/update-plan/:planId", authenticateAdmin, updatePlan);
router.patch("/toggle-plan/:planId", authenticateAdmin, togglePlanStatus);
router.get("/subscribers", authenticateAdmin, getAllSubscribers);


export default router ;

