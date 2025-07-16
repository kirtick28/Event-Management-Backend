const Event = require('../model/Event');
const User = require('../model/User');

const createEvent = async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.eventDate || !data.location || !data.capacity) {
      return res.status(400).json({
        status: 'Fail',
        message: 'Data must have Title, eventDate, location, capacity fields'
      });
    }
    const existEvent = await Event.findOne({ title: data.title });
    if (existEvent) {
      return res.status(409).json({
        status: 'Fail',
        message: 'Event with same title already exists'
      });
    }
    const event = new Event(data);
    await event.save();
    return res.status(201).json({
      status: 'Success',
      data: {
        eventId: event._id
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Fail',
      message: err.message
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate({
      path: 'registrations.userId',
      select: 'name email -_id'
    });
    return res.status(200).json({
      status: 'Success',
      data: {
        events
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Fail',
      message: err.message
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate({
      path: 'registrations.userId',
      select: 'name email -_id'
    });
    if (!event) {
      return res.status(404).json({
        status: 'Failure',
        message: 'Event not found'
      });
    }
    return res.status(200).json({
      status: 'Success',
      data: {
        event
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Fail',
      message: err.message
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      runValidators: true,
      new: true
    });
    if (!updatedEvent) {
      res.status(404).json({
        status: 'Failure',
        message: 'Event does not exist'
      });
    }
    return res.status(200).json({
      status: 'Success',
      data: {
        updatedEvent
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Fail',
      message: err.message
    });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const { sortDate, sortLocation } = req.query;
    const sortQuery = {};
    if (sortDate) {
      sortQuery.eventDate = sortDate == 'asc' ? 1 : -1;
    }
    if (sortLocation) {
      sortQuery.location = sortLocation == 'asc' ? 1 : -1;
    }
    const current = new Date();
    const data = await Event.find({ eventDate: { $gt: current } }).sort(
      sortQuery
    );
    return res.status(200).json({
      status: 'Success',
      data: {
        upcomingEvents: data
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Fail',
      message: err.message
    });
  }
};

const registerEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    const user = await User.findById(id);
    const currentDate = new Date();
    if (!event || event.eventDate <= currentDate) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Event does not exist or Event Completed'
      });
    }
    if (!user) {
      return res.status(400).json({
        status: 'Failure',
        message: 'User does not exists'
      });
    }
    const alreadyRegistered = user.registeredEvents.find(
      (el) => el.eventId == eventId
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        status: 'Failure',
        message: 'User already Registered for this event'
      });
    }

    event.registrations.push({
      userId: id,
      date: new Date()
    });
    await event.save();

    user.registeredEvents.push({
      eventId
    });
    await user.save();

    return res.status(200).json({
      status: 'Success',
      message: 'Event Registered Successfully'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Failure',
      message: err.message
    });
  }
};

const unregisterEvent = async (req, res) => {
  try {
    const { id } = req.user;
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    const user = await User.findById(id);
    const currentDate = new Date();
    if (!event || event.eventDate <= currentDate) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Event does not exist or Event Completed'
      });
    }
    if (!user) {
      return res.status(400).json({
        status: 'Failure',
        message: 'User does not exists'
      });
    }
    const alreadyRegistered = user.registeredEvents.find(
      (el) => el.eventId == eventId
    );

    if (!alreadyRegistered) {
      return res.status(400).json({
        status: 'Failure',
        message: 'User not Registered for this event. Invalid Request'
      });
    }

    event.registrations = event.registrations.filter((el) => el.userId != id);
    await event.save();
    user.registeredEvents = user.registeredEvents.filter(
      (el) => el.eventId != eventId
    );
    await user.save();
    return res.status(200).json({
      status: 'Success',
      message: 'Event Un-Registered Successfully'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Failure',
      message: err.message
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  registerEvent,
  unregisterEvent,
  getUpcomingEvents
};
