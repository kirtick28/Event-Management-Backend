const User = require('../model/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/JWTtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Data must have name, email and password'
      });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPass
    });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({
      status: 'Success',
      token
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Failed',
      message: err.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Data must have email and password'
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        status: 'Failed',
        message: 'User Not found'
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Invalid Credentials'
      });
    }
    const token = generateToken(user);
    res.status(200).json({
      status: 'Success',
      token
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Failed',
      message: err.message
    });
  }
};

module.exports = {
  signup,
  login
};
