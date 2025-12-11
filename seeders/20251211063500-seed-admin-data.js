'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const now = new Date();

        // 1. Create default groups
        const groups = [
            {
                id: uuidv4(),
                code: 'ADMIN',
                name: 'Quản trị viên',
                note: 'Nhóm quản trị hệ thống với toàn quyền',
                status: 'active',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                code: 'MANAGER',
                name: 'Quản lý',
                note: 'Nhóm quản lý hợp đồng và dữ liệu',
                status: 'active',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                code: 'USER',
                name: 'Người dùng',
                note: 'Nhóm người dùng thông thường',
                status: 'active',
                createdAt: now,
                updatedAt: now
            }
        ];

        await queryInterface.bulkInsert('user_groups', groups, {});

        // 2. Create default permissions for each group
        const permissions = [];
        const permissionNames = [
            { name: 'Dashboard', isParent: false },
            { name: 'Quản lý hợp đồng', isParent: true },
            { name: 'Danh sách hợp đồng', isParent: false, parent: 'Quản lý hợp đồng' },
            { name: 'Điều khoản thanh toán', isParent: false, parent: 'Quản lý hợp đồng' },
            { name: 'Chi phí', isParent: false, parent: 'Quản lý hợp đồng' },
            { name: 'Danh mục', isParent: true },
            { name: 'Khách hàng', isParent: false, parent: 'Danh mục' },
            { name: 'Nhà cung cấp', isParent: false, parent: 'Danh mục' },
            { name: 'Thống kê - Báo cáo', isParent: false },
            { name: 'Quản trị hệ thống', isParent: false }
        ];

        // Create permissions for each group
        groups.forEach(group => {
            const groupPermissions = [];
            const parentMap = {};

            permissionNames.forEach(perm => {
                const permId = uuidv4();
                const isAdmin = group.code === 'ADMIN';
                const isManager = group.code === 'MANAGER';

                const permission = {
                    id: permId,
                    groupId: group.id,
                    name: perm.name,
                    isParent: perm.isParent,
                    parentId: perm.parent ? parentMap[perm.parent] : null,
                    canView: isAdmin || isManager || perm.name === 'Dashboard',
                    canAdd: isAdmin || (isManager && perm.name !== 'Quản trị hệ thống'),
                    canEdit: isAdmin || (isManager && perm.name !== 'Quản trị hệ thống'),
                    canDelete: isAdmin,
                    createdAt: now,
                    updatedAt: now
                };

                if(perm.isParent) {
                    parentMap[perm.name] = permId;
                }

                groupPermissions.push(permission);
            });

            permissions.push(...groupPermissions);
        });

        await queryInterface.bulkInsert('permissions', permissions, {});

        // 3. Create default system configs
        const configs = [
            {
                id: uuidv4(),
                key: 'system_name',
                value: 'CEH Contract Management System',
                type: 'string',
                category: 'general',
                description: 'Tên hệ thống',
                isEditable: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                key: 'company_name',
                value: 'Cảng Biển Số Việt Nam',
                type: 'string',
                category: 'general',
                description: 'Tên công ty',
                isEditable: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                key: 'warning_days_before',
                value: '30',
                type: 'number',
                category: 'notification',
                description: 'Số ngày cảnh báo trước khi hết hạn',
                isEditable: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                key: 'enable_email_notification',
                value: 'true',
                type: 'boolean',
                category: 'notification',
                description: 'Bật thông báo email',
                isEditable: true,
                createdAt: now,
                updatedAt: now
            }
        ];

        await queryInterface.bulkInsert('system_configs', configs, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('permissions', null, {});
        await queryInterface.bulkDelete('system_configs', null, {});
        await queryInterface.bulkDelete('user_groups', null, {});
    }
};
