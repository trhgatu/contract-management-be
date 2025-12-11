const { AuditLog } = require('../models');

/**
 * Log a system action
 * @param {Object} params
 * @param {string} params.userId - User ID performing the action
 * @param {string} params.screen - Screen/Feature name (e.g. 'AUTH', 'CONTRACT', 'CUSTOMER')
 * @param {string} params.action - Action type (e.g. 'LOGIN', 'CREATE', 'UPDATE', 'DELETE')
 * @param {Object} [params.details] - Optional details/metadata about the action
 * @param {Object} [params.req] - Express request object to extract IP/UserAgent
 */
const logAction = async ({ userId, screen, action, details, req }) => {
    try {
        const logData = {
            userId,
            screen,
            action,
            details,
        };

        if(req) {
            logData.ipAddress = req.ip || req.connection.remoteAddress;
            logData.userAgent = req.get('user-agent');
        }

        await AuditLog.create(logData);
    } catch(error) {
        console.error('Error writing audit log:', error);
        // Don't throw error to avoid breaking the main request flow
    }
};

module.exports = { logAction };
