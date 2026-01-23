import express from 'express';
import { getReports, getReportsSummary, exportReports } from '../../controller/reports/reports.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// GET /api/reports - Get filtered reports with pagination
router.get('/', getReports);

// GET /api/reports/summary - Get reports summary/statistics
router.get('/summary', getReportsSummary);

// GET /api/reports/export - Export reports data
router.get('/export', exportReports);

export default router;