const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      'Please enter a valid email address'
    ],
    unique: true
  },
  role: {
    type: 'String',
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: true
  },
  registeredEvents: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
      },
      registeredAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
