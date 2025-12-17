const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, delete: deleteItem } = require('../controllers/masterDataController');
const { protect, authorize } = require('../middlewares/auth');

// All routes are protected - user must be logged in
router.use(protect);

// Generic routes for all master data types
// Types: customers, suppliers, software, status, contract-types, units

// Read operations - all authenticated users
/**
 * @swagger
 * tags:
 *   name: MasterData
 *   description: Generic Master Data Management
 */

/**
 * @swagger
 * /api/master-data/{type}:
 *   get:
 *     summary: Get all items of a specific type
 *     tags: [MasterData]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *           enum: [customers, suppliers, software, status, contract-types, units, personnel, job-categories, expense-categories]
 *         required: true
 *         description: Type of master data
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Create a new item
 *     tags: [MasterData]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item created
 */
router.get('/:type', getAll);
router.post('/:type', authorize('admin', 'manager'), create);

/**
 * @swagger
 * /api/master-data/{type}/{id}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [MasterData]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Item details
 *   put:
 *     summary: Update an item
 *     tags: [MasterData]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item updated
 *   delete:
 *     summary: Delete an item
 *     tags: [MasterData]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Item deleted
 */
router.get('/:type/:id', getOne);
router.put('/:type/:id', authorize('admin', 'manager'), update);
router.delete('/:type/:id', authorize('admin'), deleteItem);

module.exports = router;
