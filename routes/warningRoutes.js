const express = require('express');
const {
    getWarnings,
    getWarning,
    updateWarning,
    createWarning,
    deleteWarning,
    generateWarnings
} = require('../controllers/warningController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Warnings
 *   description: Warning System
 */

/**
 * @swagger
 * /api/warnings:
 *   get:
 *     summary: Get warnings
 *     tags: [Warnings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of warnings
 *   post:
 *     summary: Create manual warning
 *     tags: [Warnings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Warning created
 */
router
    .route('/')
    .get(getWarnings)
    .post(createWarning);

/**
 * @swagger
 * /api/warnings/generate:
 *   post:
 *     summary: Trigger manual generation of warnings
 *     tags: [Warnings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warnings generated
 */
router.post('/generate', generateWarnings);

/**
 * @swagger
 * /api/warnings/{id}:
 *   get:
 *     summary: Get warning detail
 *     tags: [Warnings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Warning detail
 *   put:
 *     summary: Update warning
 *     tags: [Warnings]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warning updated
 *   delete:
 *     summary: Delete warning
 *     tags: [Warnings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warning deleted
 */
router
    .route('/:id')
    .get(getWarning)
    .put(updateWarning)
    .delete(deleteWarning);

module.exports = router;
