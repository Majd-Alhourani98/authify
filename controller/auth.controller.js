const HTTP_STATUS = require('../constants/httpStatus');
const RESPONSE_STATUS = require('../constants/responseStatus');

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  res.status(HTTP_STATUS.CREATED).json({
    status: RESPONSE_STATUS.SUCCESS,
    data: { user },
  });
});

module.exports = { signup };
