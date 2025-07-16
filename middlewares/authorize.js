const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          status: 'Unauthorized',
          message: 'Authentication required.'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: 'Denied',
          message: 'Unauthorized to access the endpoint'
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        status: 'Failed',
        message: 'Error in authorization'
      });
    }
  };
};

module.exports = authorize;
