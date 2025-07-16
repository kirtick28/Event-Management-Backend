const bcrypt = require('bcrypt');
const User = require('../model/User');
const Event = require('../model/Event');

const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const updateData = req.body;
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.email) {
      const existUser = await User.findOne({ email: updateData.email });
      if (existUser)
        res.status(400).json({
          status: 'Failure',
          message: 'Email alredy exists'
        });
    }
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: 'Success',
      data: {
        user
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Failure',
      message: err.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(201).json({
      status: 'Success',
      data: {
        users
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Failure',
      message: err.message
    });
  }
};

module.exports = { updateUser, getAllUsers };
