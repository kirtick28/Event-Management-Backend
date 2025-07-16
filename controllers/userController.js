const bcrypt = require('bcrypt');
const User = require('../model/User');
const Event = require('../model/Event');

const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const updateData = req.body;
    if (updateData && updateData.password !== undefined) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData && updateData.email !== undefined) {
      const existUser = await User.findOne({ email: updateData.email });
      if (existUser)
        res.status(400).json({
          status: 'Failure',
          message: 'Email alredy exists'
        });
    }
    if (updateData && updateData.role) {
      return res.status(403).json({
        status: 'Failure',
        message: 'Forbidden to change the role'
      });
    }
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('name email role registeredEvents');

    res.status(200).json({
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
    const users = await User.find({ role: 'user' })
      .populate({
        path: 'registeredEvents.eventId',
        select: 'title eventDate location capacity -_id'
      })
      .select('name email registeredEvents');
    return res.status(200).json({
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
