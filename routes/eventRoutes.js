const express = require('express');
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  getUpcomingEvents,
  registerEvent,
  unregisterEvent
} = require('../controllers/eventController');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');

router
  .route('/')
  .get(authenticate, getAllEvents)
  .post(authenticate, authorize('admin'), createEvent);

router.route('/upcoming').get(authenticate, getUpcomingEvents);

router
  .route('/:id')
  .get(authenticate, getEventById)
  .put(authenticate, authorize('admin'), updateEvent);

router
  .route('/register/:eventId')
  .post(authenticate, authorize('user'), registerEvent);

router
  .route('/unregister/:eventId')
  .post(authenticate, authorize('user'), unregisterEvent);

module.exports = router;
