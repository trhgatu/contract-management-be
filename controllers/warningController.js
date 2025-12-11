const { Warning, Contract, MasterDataCustomer } = require('../models');

// @desc    Get all warnings
// @route   GET /api/warnings
// @access  Private
exports.getWarnings = async (req, res) => {
    try {
        const { type, status, startDate, endDate } = req.query;

        let whereClause = {};

        // Filter by type if provided
        if(type && type !== 'all') {
            whereClause.type = type;
        }

        // Filter by status if provided
        if(status) {
            whereClause.status = status;
        }

        // Filter by date range if provided
        if(startDate || endDate) {
            whereClause.dueDate = {};
            if(startDate) whereClause.dueDate[Op.gte] = startDate;
            if(endDate) whereClause.dueDate[Op.lte] = endDate;
        }

        const warnings = await Warning.findAll({
            where: whereClause,
            include: [
                {
                    model: Contract,
                    as: 'contract',
                    attributes: ['id', 'code', 'signDate'],
                    include: [
                        { model: MasterDataCustomer, as: 'customer', attributes: ['id', 'name'] }
                    ]
                }
            ],
            order: [['dueDate', 'ASC'], ['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: warnings.length,
            data: warnings
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Get single warning
// @route   GET /api/warnings/:id
// @access  Private
exports.getWarning = async (req, res) => {
    try {
        const warning = await Warning.findByPk(req.params.id, {
            include: [
                {
                    model: Contract,
                    as: 'contract',
                    include: [{ model: MasterDataCustomer, as: 'customer' }]
                }
            ]
        });

        if(!warning) {
            return res.status(404).json({ success: false, message: 'Warning not found' });
        }

        res.status(200).json({
            success: true,
            data: warning
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Update warning status
// @route   PUT /api/warnings/:id
// @access  Private
exports.updateWarning = async (req, res) => {
    try {
        let warning = await Warning.findByPk(req.params.id);

        if(!warning) {
            return res.status(404).json({ success: false, message: 'Warning not found' });
        }

        // Only allow updating status and note
        const { status, note } = req.body;
        warning = await warning.update({ status, note });

        res.status(200).json({
            success: true,
            data: warning
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Generate warnings from contracts
// @route   POST /api/warnings/generate
// @access  Private (Admin only)
exports.generateWarnings = async (req, res) => {
    try {
        // This is a placeholder for auto-generating warnings logic
        // In a real implementation, you would:
        // 1. Query all active contracts
        // 2. Check payment terms for upcoming/overdue payments
        // 3. Check acceptance dates
        // 4. Check contract expiry dates
        // 5. Create warnings accordingly

        res.status(200).json({
            success: true,
            message: 'Warning generation is not yet implemented. Use manual warning creation for now.'
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Create warning manually
// @route   POST /api/warnings
// @access  Private
exports.createWarning = async (req, res) => {
    try {
        const warning = await Warning.create(req.body);

        res.status(201).json({
            success: true,
            data: warning
        });
    } catch(err) {
        if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            const messages = err.errors.map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Delete warning
// @route   DELETE /api/warnings/:id
// @access  Private
exports.deleteWarning = async (req, res) => {
    try {
        const warning = await Warning.findByPk(req.params.id);

        if(!warning) {
            return res.status(404).json({ success: false, message: 'Warning not found' });
        }

        await warning.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};
