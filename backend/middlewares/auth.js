const jwt = require('jsonwebtoken');
const { User } = require('../backend/models');

// Middleware to authenticate user
exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id using Sequelize
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
exports.adminMiddleware = async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied, admin privileges required' });
    }
  } catch (error) {
    console.error('Admin middleware error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}; 