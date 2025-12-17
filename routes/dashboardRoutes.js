const express = require('express');
const { getKPIs, getTopCustomers, getWarningsSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard Statistics
 */

/**
 * @swagger
 * /api/dashboard/kpis:
 *   get:
 *     summary: Get Key Performance Indicators
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KPI data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/kpis', getKPIs);

/**
 * @swagger
 * /api/dashboard/top-customers:
 *   get:
 *     summary: Get top customers by revenue/activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top customers list
 */
router.get('/top-customers', getTopCustomers);

/**
 * @swagger
 * /api/dashboard/warnings-summary:
 *   get:
 *     summary: Get summary of active warnings
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warnings summary
 */
router.get('/warnings-summary', getWarningsSummary);

module.exports = router;