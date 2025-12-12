const HTTP_STATUS = require('../constants/httpStatus');
const RESPONSE_STATUS = require('../constants/responseStatus');
const { ValidationError } = require('../errors/customErrors');

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, verifyMethod } = req.body;

  if (verifyMethod !== 'otp' && verifyMethod !== 'link') {
    return next(new ValidationError('verifyMethod must be either `link` or `otp`'));
  }

  const user = new User({ name, email, password, passwordConfirm });

  const { message, otp, token } = user.applyVerificationMethod(verifyMethod);
  await user.save();

  res.status(HTTP_STATUS.CREATED).json({
    status: RESPONSE_STATUS.SUCCESS,
    data: { user },
    message: message,
  });
});

module.exports = { signup };
