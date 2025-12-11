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

// User management
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Group management
router.get('/groups', getGroups);
router.post('/groups', createGroup);
router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);

// Permission management
router.get('/permissions/:groupId', getPermissions);
router.put('/permissions-bulk', updatePermissionsBulk);
router.put('/permissions/:id', updatePermission);

// Audit logs
router.get('/logs', getLogs);
router.post('/logs', createLog);

// System config
router.get('/configs', getConfigs);
router.put('/configs/:id', updateConfig);

module.exports = router;
