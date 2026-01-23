import mongoose from 'mongoose';
import InvoiceTaxForm from '../../models/forms/invoiceTaxForm.js';

// Get reports with filters
export const getReports = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      dateFrom,
      dateTo,
      status = 'all',
      documentType = 'all',
      page = 1,
      limit = 50,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build match conditions
    const matchConditions = {
      createdBy: new mongoose.Types.ObjectId(userId),
      isDeleted: false
    };

    // Date range filter
    if (dateFrom || dateTo) {
      matchConditions['invoiceMeta.invoiceDate'] = {};
      if (dateFrom) {
        matchConditions['invoiceMeta.invoiceDate'].$gte = new Date(dateFrom);
      }
      if (dateTo) {
        matchConditions['invoiceMeta.invoiceDate'].$lte = new Date(dateTo);
      }
    }

    // Document type filter
    if (documentType !== 'all') {
      matchConditions.documentType = documentType;
    }

    // Status filter - this will be calculated based on payment status
    let statusFilter = null;
    if (status !== 'all') {
      statusFilter = status;
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchConditions },
      
      // Add a stage to normalize paymentStatus before filtering
      {
        $addFields: {
          normalizedPaymentStatus: { $ifNull: ['$paymentStatus', 'unpaid'] }
        }
      },
      
      // Filter by status if specified (use normalized paymentStatus field)
      ...(statusFilter ? [{ $match: { normalizedPaymentStatus: statusFilter } }] : []),

      // Project the fields we need
      {
        $project: {
          _id: 1,
          invoiceNumber: '$invoiceMeta.invoiceNo',
          currency: '$invoiceMeta.currency',
          documentType: 1,
          invoiceDate: '$invoiceMeta.invoiceDate',
          dueDate: '$invoiceMeta.dueDate',
          subtotal: '$totals.subtotal',
          taxAmount: '$totals.taxTotal',
          total: '$totals.grandTotal',
          paidAmount: { $ifNull: ['$paidAmount', 0] },
          paymentStatus: { $ifNull: ['$paymentStatus', 'unpaid'] },
          customer: '$client',
          createdAt: 1,
          updatedAt: 1
        }
      },

      // Sort
      {
        $sort: {
          [sortBy === 'date' ? 'invoiceDate' : sortBy]: sortOrder === 'desc' ? -1 : 1
        }
      }
    ];

    // Get total count for pagination
    const totalCountPipeline = [...pipeline, { $count: 'total' }];
    const totalCountResult = await InvoiceTaxForm.aggregate(totalCountPipeline);
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].total : 0;

    // Add pagination
    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    );

    // Execute aggregation
    const reports = await InvoiceTaxForm.aggregate(pipeline);

    // Calculate totals
    const totalsPipeline = [
      { $match: matchConditions },
      // Add normalized paymentStatus for filtering
      {
        $addFields: {
          normalizedPaymentStatus: { $ifNull: ['$paymentStatus', 'unpaid'] }
        }
      },
      ...(statusFilter ? [{ $match: { normalizedPaymentStatus: statusFilter } }] : []),
      {
        $group: {
          _id: null,
          totalSubtotal: { $sum: '$totals.subtotal' },
          totalTax: { $sum: '$totals.taxTotal' },
          totalPaidAmount: { $sum: { $ifNull: ['$paidAmount', 0] } },
          totalAmount: { $sum: '$totals.grandTotal' },
          count: { $sum: 1 }
        }
      }
    ];

    const totalsResult = await InvoiceTaxForm.aggregate(totalsPipeline);
    const totals = totalsResult.length > 0 ? totalsResult[0] : {
      totalSubtotal: 0,
      totalTax: 0,
      totalPaidAmount: 0,
      totalAmount: 0,
      count: 0
    };

    // Format the response
    const formattedReports = reports.map(report => ({
      id: report._id,
      customer: report.customer ? {
        name: report.customer.name,
        address: report.customer.address,
        email: report.customer.email,
        city: report.customer.city,
        state: report.customer.state,
        zip: report.customer.zip
      } : null,
      customerName: report.customer?.name || '',
      customerAddress: report.customer?.address || '',
      documentType: report.documentType || 'invoice',
      number: report.invoiceNumber,
      date: report.invoiceDate,
      dueDate: report.dueDate,
      subtotal: report.subtotal || 0,
      tax: report.taxAmount || 0,
      paidAmount: report.paidAmount || 0,
      total: report.total || 0,
      currency: report.currency || 'INR',
      paymentStatus: report.paymentStatus,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));

    res.json({
      success: true,
      data: {
        reports: formattedReports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount,
          limit: parseInt(limit)
        },
        totals: {
          subtotal: totals.totalSubtotal,
          tax: totals.totalTax,
          paidAmount: totals.totalPaidAmount,
          total: totals.totalAmount,
          count: totals.count
        },
        filters: {
          dateFrom,
          dateTo,
          status,
          documentType
        }
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

// Get reports summary/statistics
export const getReportsSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'all' } = req.query;

    // Build date filter based on period
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'today':
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        };
        break;
      case 'thisWeek':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        dateFilter = {
          $gte: startOfWeek,
          $lt: new Date()
        };
        break;
      case 'thisMonth':
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        };
        break;
      case 'lastMonth':
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          $lt: new Date(now.getFullYear(), now.getMonth(), 1)
        };
        break;
      case 'thisQuarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        dateFilter = {
          $gte: quarterStart,
          $lt: new Date()
        };
        break;
      case 'lastQuarter':
        const lastQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1);
        const lastQuarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        dateFilter = {
          $gte: lastQuarterStart,
          $lt: lastQuarterEnd
        };
        break;
      case 'thisYear':
        dateFilter = {
          $gte: new Date(now.getFullYear(), 0, 1),
          $lt: new Date()
        };
        break;
    }

    const matchConditions = {
      createdBy: new mongoose.Types.ObjectId(userId),
      isDeleted: false
    };

    if (Object.keys(dateFilter).length > 0) {
      matchConditions['invoiceMeta.invoiceDate'] = dateFilter;
    }

    const pipeline = [
      { $match: matchConditions },
      {
        $group: {
          _id: { $ifNull: ['$paymentStatus', 'unpaid'] },
          count: { $sum: 1 },
          totalAmount: { $sum: '$totals.grandTotal' },
          totalPaid: { $sum: { $ifNull: ['$paidAmount', 0] } }
        }
      }
    ];

    const summaryResult = await InvoiceTaxForm.aggregate(pipeline);

    // Format summary data
    const summary = {
      paid: { count: 0, totalAmount: 0, totalPaid: 0 },
      unpaid: { count: 0, totalAmount: 0, totalPaid: 0 },
      partiallyPaid: { count: 0, totalAmount: 0, totalPaid: 0 },
      overdue: { count: 0, totalAmount: 0, totalPaid: 0 }
    };

    summaryResult.forEach(item => {
      if (summary[item._id]) {
        summary[item._id] = {
          count: item.count,
          totalAmount: item.totalAmount,
          totalPaid: item.totalPaid
        };
      }
    });

    // Calculate overall totals
    const overallTotals = summaryResult.reduce((acc, item) => ({
      totalInvoices: acc.totalInvoices + item.count,
      totalAmount: acc.totalAmount + item.totalAmount,
      totalPaid: acc.totalPaid + item.totalPaid
    }), { totalInvoices: 0, totalAmount: 0, totalPaid: 0 });

    res.json({
      success: true,
      data: {
        summary,
        totals: overallTotals,
        period
      }
    });

  } catch (error) {
    console.error('Get reports summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports summary',
      error: error.message
    });
  }
};

// Export reports to CSV/Excel format
export const exportReports = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      dateFrom,
      dateTo,
      status = 'all',
      documentType = 'all',
      format = 'csv'
    } = req.query;

    // Use the same logic as getReports but without pagination
    const matchConditions = {
      createdBy: new mongoose.Types.ObjectId(userId),
      isDeleted: false
    };

    if (dateFrom || dateTo) {
      matchConditions['invoiceMeta.invoiceDate'] = {};
      if (dateFrom) {
        matchConditions['invoiceMeta.invoiceDate'].$gte = new Date(dateFrom);
      }
      if (dateTo) {
        matchConditions['invoiceMeta.invoiceDate'].$lte = new Date(dateTo);
      }
    }

    if (documentType !== 'all') {
      matchConditions.documentType = documentType;
    }

    let statusFilter = null;
    if (status !== 'all') {
      statusFilter = status;
    }

    const pipeline = [
      { $match: matchConditions },
      ...(statusFilter ? [{ $match: { paymentStatus: statusFilter } }] : []),
      {
        $project: {
          invoiceNumber: '$invoiceMeta.invoiceNo',
          currency: '$invoiceMeta.currency',
          documentType: 1,
          invoiceDate: '$invoiceMeta.invoiceDate',
          dueDate: '$invoiceMeta.dueDate',
          subtotal: '$totals.subtotal',
          taxAmount: '$totals.taxTotal',
          total: '$totals.grandTotal',
          paidAmount: { $ifNull: ['$paidAmount', 0] },
          paymentStatus: { $ifNull: ['$paymentStatus', 'unpaid'] },
          customerName: '$client.name',
          customerAddress: '$client.address'
        }
      },
      { $sort: { invoiceDate: -1 } }
    ];

    const reports = await InvoiceTaxForm.aggregate(pipeline);

    if (format === 'json') {
      res.json({
        success: true,
        data: reports
      });
    } else {
      // For CSV format, we'll return the data and let the frontend handle CSV generation
      // In a real implementation, you might want to generate CSV on the backend
      res.json({
        success: true,
        data: reports,
        format: 'csv'
      });
    }

  } catch (error) {
    console.error('Export reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export reports',
      error: error.message
    });
  }
};

