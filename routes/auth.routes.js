const express = require('express');
const authController = require('../controller/auth.controller');

const router = express();

router.route('/signup').post(authController.signup);
router.route('/user/:id').get(authController.getUser);
module.exports = router;
