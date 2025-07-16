const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.route('/login').post(login);
router.route('/signup').post(signup);

module.exports = router;
