const {
    MasterDataCustomer,
    MasterDataSupplier,
    MasterDataSoftware,
    MasterDataStatus,
    MasterDataContractType,
    MasterDataUnit,
    MasterDataPersonnel // Imported
} = require('../models');
const { logAction } = require('../utils/logger');

// Generic function to handle CRUD for all master data types
const getMasterDataModel = (type) => {
    const models = {
        'customers': MasterDataCustomer,
        'suppliers': MasterDataSupplier,
        'software': MasterDataSoftware,
        'status': MasterDataStatus,
        'contract-types': MasterDataContractType,
        'units': MasterDataUnit,
        'personnel': MasterDataPersonnel // Mapped
    };
    return models[type];
};

// @desc    Get all items for a master data type
// @route   GET /api/master-data/:type
// @access  Private
exports.getAll = async (req, res) => {
    try {
        const { type } = req.params;
        const Model = getMasterDataModel(type);

        if(!Model) {
            return res.status(400).json({ success: false, message: 'Invalid master data type' });
        }

        const items = await Model.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Get single item
// @route   GET /api/master-data/:type/:id
// @access  Private
exports.getOne = async (req, res) => {
    try {
        const { type, id } = req.params;
        const Model = getMasterDataModel(type);

        if(!Model) {
            return res.status(400).json({ success: false, message: 'Invalid master data type' });
        }

        const item = await Model.findByPk(id);

        if(!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Create new item
// @route   POST /api/master-data/:type
// @access  Private (Admin only)
exports.create = async (req, res) => {
    try {
        const { type } = req.params;
        const Model = getMasterDataModel(type);

        if(!Model) {
            return res.status(400).json({ success: false, message: 'Invalid master data type' });
        }

        const item = await Model.create(req.body);

        await logAction({
            userId: req.user.id,
            screen: 'MASTER_DATA',
            action: 'CREATE',
            details: { type, id: item.id, data: req.body },
            req
        });

        res.status(201).json({
            success: true,
            data: item
        });
    } catch(err) {
        if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            const messages = err.errors.map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Update item
// @route   PUT /api/master-data/:type/:id
// @access  Private (Admin only)
exports.update = async (req, res) => {
    try {
        const { type, id } = req.params;
        const Model = getMasterDataModel(type);

        if(!Model) {
            return res.status(400).json({ success: false, message: 'Invalid master data type' });
        }

        let item = await Model.findByPk(id);

        if(!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        item = await item.update(req.body);

        await logAction({
            userId: req.user.id,
            screen: 'MASTER_DATA',
            action: 'UPDATE',
            details: { type, id: item.id, changed: req.body },
            req
        });

        res.status(200).json({
            success: true,
            data: item
        });
    } catch(err) {
        if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            const messages = err.errors.map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};

// @desc    Delete item
// @route   DELETE /api/master-data/:type/:id
// @access  Private (Admin only)
exports.delete = async (req, res) => {
    try {
        const { type, id } = req.params;
        const Model = getMasterDataModel(type);

        if(!Model) {
            return res.status(400).json({ success: false, message: 'Invalid master data type' });
        }

        const item = await Model.findByPk(id);

        if(!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        await item.destroy();

        await logAction({
            userId: req.user.id,
            screen: 'MASTER_DATA',
            action: 'DELETE',
            details: { type, id },
            req
        });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
    }
};
