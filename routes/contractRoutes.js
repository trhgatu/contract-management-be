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
router.get('/', getContracts); // All can view
router.post('/', authorize('admin', 'manager'), createContract); // Admin/Manager can create

router.get('/:id', getContract); // All can view
router.put('/:id', authorize('admin', 'manager'), updateContract); // Admin/Manager can update
router.delete('/:id', authorize('admin'), deleteContract); // Admin only can delete

// Nested routes for payment terms
router
  .route('/:id/payment-terms')
  .post(addPaymentTerm);

router
  .route('/:id/payment-terms/:termId')
  .put(updatePaymentTerm);

// Nested routes for expenses
router
  .route('/:id/expenses')
  .post(addExpense);

router
  .route('/:id/expenses/:expenseId')
  .put(updateExpense);

// Nested routes for members
router
  .route('/:id/members')
  .post(addMember);

router
  .route('/:id/members/:memberId')
  .delete(deleteMember);

module.exports = router;
