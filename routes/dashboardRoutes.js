const express = require('express');
const { getKPIs, getTopCustomers, getWarningsSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/kpis', getKPIs);
router.get('/top-customers', getTopCustomers);
router.get('/warnings-summary', getWarningsSummary);

module.exports = router;