const express = require('express');
const {
  getUsers,
  updateUser,
  deleteUser,
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getPermissions,
  updatePermission,
  getLogs,
  createLog,
  getConfigs,
  updateConfig,
  updatePermissionsBulk
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: System Administration
 */

// User management
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user (Admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 */
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Group management
/**
 * @swagger
 * /api/admin/groups:
 *   get:
 *     summary: Get user groups
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 *   post:
 *     summary: Create user group
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Group created
 */
router.get('/groups', getGroups);
router.post('/groups', createGroup);

router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);

// Permission management
router.get('/permissions/:groupId', getPermissions);
router.put('/permissions-bulk', updatePermissionsBulk);
router.put('/permissions/:id', updatePermission);

// Audit logs
/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get audit logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of logs
 */
router.get('/logs', getLogs);
router.post('/logs', createLog);

// System config
router.get('/configs', getConfigs);
router.put('/configs/:id', updateConfig);

module.exports = router;
