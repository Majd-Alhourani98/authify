const express = require('express');
const authController = require('../controller/auth.controller');

const router = express();

router.route('/signup').post(authController.signup);
router.route('/resend').post(authController.resendVerification);
module.exports = router;
