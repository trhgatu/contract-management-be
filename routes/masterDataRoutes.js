const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, delete: deleteItem } = require('../controllers/masterDataController');
const { protect, authorize } = require('../middlewares/auth');

// All routes are protected - user must be logged in
router.use(protect);

// Generic routes for all master data types
// Types: customers, suppliers, software, status, contract-types, units

// Read operations - all authenticated users
router.get('/:type', getAll);
router.get('/:type/:id', getOne);

// Write operations - admin and manager only
router.post('/:type', authorize('admin', 'manager'), create);
router.put('/:type/:id', authorize('admin', 'manager'), update);
router.delete('/:type/:id', authorize('admin'), deleteItem);

module.exports = router;
