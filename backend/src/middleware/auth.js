 const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      message: 'Access token is required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        message: 'Invalid or expired token' 
      });
    }

    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'SYSTEM_ADMIN') {
    return res.status(403).json({ 
      message: 'Admin access required' 
    });
  }
  next();
};

const requireStoreOwner = (req, res, next) => {
  if (req.user.role !== 'STORE_OWNER') {
    return res.status(403).json({ 
      message: 'Store owner access required' 
    });
  }
  next();
};

const requireNormalUser = (req, res, next) => {
  if (req.user.role !== 'NORMAL_USER') {
    return res.status(403).json({ 
      message: 'Normal user access required' 
    });
  }
  next();
};

const requireAdminOrOwner = (req, res, next) => {
  const resourceUserId = parseInt(req.params.id);
  const currentUserId = req.user.userId;
  
  if (req.user.role !== 'SYSTEM_ADMIN' && currentUserId !== resourceUserId) {
    return res.status(403).json({ 
      message: 'Access denied. You can only access your own resources.' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireStoreOwner,
  requireNormalUser,
  requireAdminOrOwner
};
