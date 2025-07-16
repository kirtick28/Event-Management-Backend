const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (data) => {
  const payload = {
    id: data._id,
    role: data.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
