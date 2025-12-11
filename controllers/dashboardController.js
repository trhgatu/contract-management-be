const { Contract, MasterDataCustomer, MasterDataStatus, Warning } = require('../models');
const { Op } = require('sequelize');

// @desc    Get KPI statistics
// @route   GET /api/dashboard/kpis
// @access  Protected (disabled for dev)
exports.getKPIs = async (req, res) => {
  try {
    // Total contracts
    const totalContracts = await Contract.count();

    // Total revenue (sum of valuePostVat)
    const totalRevenue = await Contract.sum('valuePostVat') || 0;

    // Total expenses
    const totalExpenses = await Contract.sequelize.query(
      `SELECT COALESCE(SUM(e."totalAmount"), 0) as total FROM expenses e`,
      { type: Contract.sequelize.QueryTypes.SELECT }
    );
    const expenses = totalExpenses[0]?.total || 0;

    // Warnings count
    const warningsCount = await Warning.count({
      where: { status: { [Op.ne]: 'resolved' } }
    });

    res.json({
      success: true,
      data: [
        {
          title: 'Tổng số hợp đồng',
          value: totalContracts,
          icon: 'file',
          trend: 12,
          isPositive: true,
          trendLabel: 'So với tháng trước'
        },
        {
          title: 'Số HĐ đang triển khai',
          value: await Contract.count({ where: { statusId: { [Op.ne]: null } } }),
          icon: 'files',
          trend: 8,
          isPositive: true,
          trendLabel: 'Tăng trưởng liên tục'
        },
        {
          title: 'Doanh thu (VNĐ)',
          value: totalRevenue,
          icon: 'dollar',
          trend: 15,
          isPositive: true,
          trendLabel: 'Tăng trưởng tốt'
        },
        {
          title: 'Chi phí (VNĐ)',
          value: expenses,
          icon: 'report',
          trend: -5,
          isPositive: false,
          trendLabel: 'Giảm so với tháng trước'
        }
      ]
    });
  } catch(error) {
    console.error('Error getting KPIs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KPIs',
      error: error.message
    });
  }
};

// @desc    Get top customers by revenue
// @route   GET /api/dashboard/top-customers
// @access  Protected (disabled for dev)
exports.getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Contract.findAll({
      attributes: [
        'customerId',
        [Contract.sequelize.fn('SUM', Contract.sequelize.col('valuePostVat')), 'totalRevenue'],
        [Contract.sequelize.fn('COUNT', Contract.sequelize.col('Contract.id')), 'contractCount']
      ],
      include: [{
        model: MasterDataCustomer,
        as: 'customer',
        attributes: ['name', 'code']
      }],
      group: ['Contract.customerId', 'customer.id'],
      order: [[Contract.sequelize.fn('SUM', Contract.sequelize.col('valuePostVat')), 'DESC']],
      limit: 5,
      raw: false
    });

    const formattedData = topCustomers.map(item => ({
      name: item.customer?.name || 'Unknown',
      code: item.customer?.code || 'N/A',
      revenue: parseInt(item.dataValues.totalRevenue) || 0,
      contracts: parseInt(item.dataValues.contractCount) || 0
    }));

    res.json({
      success: true,
      data: formattedData
    });
  } catch(error) {
    console.error('Error getting top customers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top customers',
      error: error.message
    });
  }
};

// @desc    Get warnings summary
// @route   GET /api/dashboard/warnings-summary
// @access  Protected (disabled for dev)
exports.getWarningsSummary = async (req, res) => {
  try {
    const warnings = await Warning.findAll({
      where: { status: { [Op.ne]: 'resolved' } },
      order: [['dueDate', 'ASC']],
      limit: 5,
      include: [{
        model: Contract,
        as: 'contract',
        attributes: ['code'],
        include: [{
          model: MasterDataCustomer,
          as: 'customer',
          attributes: ['name']
        }]
      }]
    });

    res.json({
      success: true,
      data: warnings
    });
  } catch(error) {
    console.error('Error getting warnings summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching warnings summary',
      error: error.message
    });
  }
};