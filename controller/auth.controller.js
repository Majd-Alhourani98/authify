const HTTP_STATUS = require('../constants/httpStatus');
const RESPONSE_STATUS = require('../constants/responseStatus');

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = new User({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = user.generateEmailVerificationToken();
  const otp = user.generateEmailVerificationOTP();
  await user.save();

  res.status(HTTP_STATUS.CREATED).json({
    status: RESPONSE_STATUS.SUCCESS,
    data: { user },
    otp: otp,
    token: token,
  });
});

module.exports = { signup };
