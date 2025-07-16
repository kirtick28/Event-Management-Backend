const express = require('express');
const router = express.Router();

const { getAllUsers, updateUser } = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.route('/').get(authenticate, authorize('admin'), getAllUsers);

router.route('/:id').put(authenticate, updateUser);

module.exports = router;
