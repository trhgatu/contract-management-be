const express = require('express');
const {
  getContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
  addPaymentTerm,
  updatePaymentTerm,
  addExpense,
  updateExpense,
  addMember,
  deleteMember
} = require('../controllers/contractController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Main contract routes
/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: Contract Management
 */

/**
 * @swagger
 * /api/contracts:
 *   get:
 *     summary: Get all contracts
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contracts
 *   post:
 *     summary: Create a new contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contractNumber
 *               - name
 *               - customerId
 *             properties:
 *               contractNumber:
 *                 type: string
 *               name:
 *                 type: string
 *               customerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contract created
 */
router.get('/', getContracts); // All can view
router.post('/', authorize('admin', 'manager'), createContract); // Admin/Manager can create

/**
 * @swagger
 * /api/contracts/{id}:
 *   get:
 *     summary: Get a single contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contract details
 *   put:
 *     summary: Update a contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contract updated
 *   delete:
 *     summary: Delete a contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contract deleted
 */
router.get('/:id', getContract); // All can view
router.put('/:id', authorize('admin', 'manager'), updateContract); // Admin/Manager can update
router.delete('/:id', authorize('admin'), deleteContract); // Admin only can delete

// Nested routes for payment terms
/**
 * @swagger
 * /api/contracts/{id}/payment-terms:
 *   post:
 *     summary: Add payment term to contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payment term added
 */
router
  .route('/:id/payment-terms')
  .post(addPaymentTerm);

router
  .route('/:id/payment-terms/:termId')
  .put(updatePaymentTerm);

// Nested routes for expenses
/**
 * @swagger
 * /api/contracts/{id}/expenses:
 *   post:
 *     summary: Add expense to contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Expense added
 */
router
  .route('/:id/expenses')
  .post(addExpense);

router
  .route('/:id/expenses/:expenseId')
  .put(updateExpense);

// Nested routes for members
/**
 * @swagger
 * /api/contracts/{id}/members:
 *   post:
 *     summary: Add member to contract
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Member added
 */
router
  .route('/:id/members')
  .post(addMember);

router
  .route('/:id/members/:memberId')
  .delete(deleteMember);

module.exports = router;
