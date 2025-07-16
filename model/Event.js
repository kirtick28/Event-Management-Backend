const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: String,
    min: [1, 'Minimum Capacity: 1'],
    max: [1000, 'Maximum Capacity: 1000'],
    required: true
  },
  registrations: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      registeredAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
