const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // Set token from cookie (optional)
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if(!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please login.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if(!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if(req.user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    next();
  } catch(err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if(!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if(!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
