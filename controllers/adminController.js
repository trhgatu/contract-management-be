const { User, UserGroup, Permission, AuditLog, SystemConfig } = require('../models');
const { logAction } = require('../utils/logger');
const { Op } = require('sequelize');

// ===== USER MANAGEMENT =====

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{
        model: UserGroup,
        as: 'group',
        attributes: ['id', 'name', 'code']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: users });
  } catch(error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update user (admin can update any user)
// @route   PUT /api/admin/users/:id
// @access  Admin only
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, groupId, status, password } = req.body;

    const user = await User.findByPk(id);
    if(!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if(name) user.name = name;
    if(email) user.email = email;
    if(role) user.role = role;
    if(groupId !== undefined) user.groupId = groupId;
    if(status) user.status = status;
    if(password) user.password = password; // Will be hashed by model hook

    await user.save();

    await logAction({
      userId: req.user.id,
      screen: 'ADMIN',
      action: 'UPDATE_USER',
      details: { targetUserId: user.id, changes: req.body },
      req
    });

    res.json({ success: true, data: user });
  } catch(error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if(!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.destroy();

    await logAction({
      userId: req.user.id,
      screen: 'ADMIN',
      action: 'DELETE_USER',
      details: { targetUserId: id },
      req
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch(error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ===== GROUP MANAGEMENT =====

// @desc    Get all groups
// @route   GET /api/admin/groups
// @access  Admin only
exports.getGroups = async (req, res) => {
  try {
    const groups = await UserGroup.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: groups });
  } catch(error) {
    console.error('Get groups error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create group
// @route   POST /api/admin/groups
// @access  Admin only
exports.createGroup = async (req, res) => {
  try {
    const { code, name, note } = req.body;

    const group = await UserGroup.create({ code, name, note, status: 'active' });

    await logAction({
      userId: req.user.id,
      screen: 'ADMIN',
      action: 'CREATE_GROUP',
      details: { groupId: group.id, name: group.name },
      req
    });

    res.status(201).json({ success: true, data: group });
  } catch(error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update group
// @route   PUT /api/admin/groups/:id
// @access  Admin only
exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, note, status } = req.body;

    const group = await UserGroup.findByPk(id);
    if(!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if(code) group.code = code;
    if(name) group.name = name;
    if(note !== undefined) group.note = note;
    if(status) group.status = status;

    await group.save();

    res.json({ success: true, data: group });
  } catch(error) {
    console.error('Update group error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete group
// @route   DELETE /api/admin/groups/:id
// @access  Admin only
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await UserGroup.findByPk(id);
    if(!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    await group.destroy();

    res.json({ success: true, message: 'Group deleted successfully' });
  } catch(error) {
    console.error('Delete group error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ===== PERMISSION MANAGEMENT =====

const DEFAULT_PERMISSIONS = [
  { code: 'DASHBOARD', name: 'Dashboard', isParent: false },
  { code: 'CONTRACT', name: 'Quản lý hợp đồng', isParent: true },
  { code: 'CONTRACT_LIST', name: 'Danh sách hợp đồng', parentCode: 'CONTRACT' },
  { code: 'CONTRACT_ADD', name: 'Thêm mới hợp đồng', parentCode: 'CONTRACT' },
  { code: 'CUSTOMER', name: 'Quản lý khách hàng', isParent: false },
  { code: 'SUPPLIER', name: 'Quản lý nhà cung cấp', isParent: false },
  { code: 'REPORTS', name: 'Báo cáo thống kê', isParent: false },
  { code: 'ADMIN', name: 'Quản trị hệ thống', isParent: true },
  { code: 'ADMIN_USERS', name: 'Quản lý người dùng', parentCode: 'ADMIN' },
  { code: 'ADMIN_GROUPS', name: 'Quản lý nhóm quyền', parentCode: 'ADMIN' },
  { code: 'ADMIN_LOGS', name: 'Nhật ký hoạt động', parentCode: 'ADMIN' },
];

const seedPermissionsForGroup = async (groupId) => {
  const permissions = [];

  // Create parents first to get IDs if needed, but here we just store flat with parent link logic if supported
  // For simplicity implementation matching current frontend:
  for(const perm of DEFAULT_PERMISSIONS) {
    permissions.push({
      groupId,
      name: perm.name,
      code: perm.code,
      isParent: perm.isParent || false,
      parentId: null, // Logic can be improved to link parents if DB supports self-ref
      canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false
    });
  }

  await Permission.bulkCreate(permissions);
};

// @desc    Get permissions for a group (Lazy Load / Seed)
// @route   GET /api/admin/permissions/:groupId
// @access  Admin only
exports.getPermissions = async (req, res) => {
  try {
    const { groupId } = req.params;

    let permissions = await Permission.findAll({
      where: { groupId },
      order: [['id', 'ASC']] // Order by ID to keep insertion order roughly
    });

    // Lazy Seed if empty
    if(permissions.length === 0) {
      await seedPermissionsForGroup(groupId);
      permissions = await Permission.findAll({
        where: { groupId },
        order: [['id', 'ASC']]
      });
    }

    res.json({ success: true, data: permissions });
  } catch(error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update permission
// @route   PUT /api/admin/permissions/:id
// @access  Admin only
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { canView, canAdd, canEdit, canDelete } = req.body;

    const permission = await Permission.findByPk(id);
    if(!permission) {
      return res.status(404).json({ success: false, message: 'Permission not found' });
    }

    if(canView !== undefined) permission.canView = canView;
    if(canAdd !== undefined) permission.canAdd = canAdd;
    if(canEdit !== undefined) permission.canEdit = canEdit;
    if(canDelete !== undefined) permission.canDelete = canDelete;

    await permission.save();

    res.json({ success: true, data: permission });
  } catch(error) {
    console.error('Update permission error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update multiple permissions (Batch)
// @route   PUT /api/admin/permissions-bulk
// @access  Admin only
exports.updatePermissionsBulk = async (req, res) => {
  try {
    const { permissions } = req.body; // Array of { id, canView, canAdd... }

    if(!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    // Transaction would be better here but keeping it simple with Promise.all
    const updatePromises = permissions.map(perm => {
      const { id, canView, canAdd, canEdit, canDelete } = perm;
      return Permission.update(
        { canView, canAdd, canEdit, canDelete },
        { where: { id } }
      );
    });

    await Promise.all(updatePromises);

    await logAction({
      userId: req.user.id,
      screen: 'ADMIN',
      action: 'UPDATE_PERMISSIONS_BULK',
      details: { count: permissions.length },
      req
    });

    res.json({ success: true, message: 'Permissions updated successfully' });
  } catch(error) {
    console.error('Batch update permissions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ===== AUDIT LOG =====

// @desc    Get audit logs
// @route   GET /api/admin/logs
// @access  Admin only
exports.getLogs = async (req, res) => {
  try {
    const { screen, action, startDate, endDate, limit = 100 } = req.query;

    const where = {};
    if(screen) where.screen = screen;
    if(action) where.action = action;
    if(startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const logs = await AuditLog.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ success: true, data: logs });
  } catch(error) {
    console.error('Get logs error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create audit log
// @route   POST /api/admin/logs
// @access  Protected
exports.createLog = async (req, res) => {
  try {
    const { screen, action, details } = req.body;
    const userId = req.user.id;

    const log = await AuditLog.create({
      userId,
      screen,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({ success: true, data: log });
  } catch(error) {
    console.error('Create log error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ===== SYSTEM CONFIG =====

// @desc    Get all system configs
// @route   GET /api/admin/configs
// @access  Admin only
exports.getConfigs = async (req, res) => {
  try {
    const { category } = req.query;

    const where = {};
    if(category) where.category = category;

    const configs = await SystemConfig.findAll({
      where,
      order: [['category', 'ASC'], ['key', 'ASC']]
    });

    res.json({ success: true, data: configs });
  } catch(error) {
    console.error('Get configs error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update system config
// @route   PUT /api/admin/configs/:id
// @access  Admin only
exports.updateConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    const config = await SystemConfig.findByPk(id);
    if(!config) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }

    if(!config.isEditable) {
      return res.status(403).json({ success: false, message: 'This config is not editable' });
    }

    config.value = value;
    await config.save();

    res.json({ success: true, data: config });
  } catch(error) {
    console.error('Update config error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
