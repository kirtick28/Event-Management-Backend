const { verifyToken } = require('../utils/JWTtoken');

const authenticate = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      return res.status(401).json({ status: 'Fail', message: 'Token Missing' });
    }
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'Fail', message: 'Token Missing' });
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
};

module.exports = authenticate;
