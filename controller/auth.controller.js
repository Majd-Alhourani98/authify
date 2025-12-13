const HTTP_STATUS = require('../constants/httpStatus');
const RESPONSE_STATUS = require('../constants/responseStatus');
const { ValidationError, ConflictError, NotFoundError } = require('../errors/customErrors');
const { sendVerificationEmail } = require('../services/email/emailService');
const User = require('../models/user.model');

const catchAsync = require('../utils/catchAsync');
const responseStatus = require('../constants/responseStatus');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, verifyMethod } = req.body;

  if (verifyMethod !== 'otp' && verifyMethod !== 'link') {
    return next(new ValidationError('verifyMethod must be either `link` or `otp`'));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ConflictError('Email already in used'));

  const user = new User({ name, email, password, passwordConfirm });

  const { message, otp, token } = user.applyVerificationMethod(verifyMethod);
  await user.save();

  try {
    await sendVerificationEmail(user, verifyMethod, token, otp);
  } catch (error) {
    await user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
  }

  res.status(HTTP_STATUS.CREATED).json({
    status: RESPONSE_STATUS.SUCCESS,
    data: { user },
    message: message,
  });
});

const resendVerification = catchAsync(async (req, res, next) => {
  const { email, verifyMethod = 'otp' } = req.body;

  // 1. Find the user
  const user = await User.findOne({ email });
  if (!user) return next(new NotFoundError('User not found with this email.'));

  // 2. Handle Already Verified Emails
  if (user.isEmailVerified) {
    await user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
    return res.json(RESPONSE_STATUS.OK).json({
      status: responseStatus.SUCCESS,
      message: 'Eamil is already verified',
    });
  }

  const RESEND_DELAY_MS = 2000; // 30 seconds
  const now = Date.now();
  const LOCK_TIME_MS = 60 * 1000;
  const MAX_ATTEMPTS = 10;

  // 3. Lock Check
  if (user.nextAllowedVerificationAt && now < user.nextAllowedVerificationAt.getTime()) {
    const retryAfter = Math.ceil((user.nextAllowedVerificationAt.getTime() - now) / 1000);

    return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      status: RESPONSE_STATUS.ERROR,
      message: `Too many attempts. Try again in ${retryAfter} seconds.`,
      retryAfter,
    });
  }

  // 4. Rest counters when lock expirs
  if (user.nextAllowedVerificationAt && now >= user.nextAllowedVerificationAt.getTime()) {
    user.verificationResendCount = 0;
    user.nextAllowedVerificationAt = null;
  }

  // 5. Cooldown check
  if (user.lastVerificationEmailSentAt) {
    const timeSinceLastSent = now - user.lastVerificationEmailSentAt.getTime();
    if (timeSinceLastSent < RESEND_DELAY_MS) {
      const remainingSeconds = Math.ceil((RESEND_DELAY_MS - timeSinceLastSent) / 1000);
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        status: RESPONSE_STATUS.ERROR,
        message: `Please wait ${remainingSeconds} seconds before requesting another verification email.`,
        retryAfter: remainingSeconds,
      });
    }
  }

  // 6.  Increment attempt counters
  user.verificationResendCount = (user.verificationResendCount || 0) + 1;

  if (user.verificationResendCount >= MAX_ATTEMPTS) {
    user.nextAllowedVerificationAt = now + LOCK_TIME_MS;
  }

  user.lastVerificationEmailSentAt = now;
  const { message, otp, token } = user.applyVerificationMethod(verifyMethod);
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(user, verifyMethod, token, otp);
  } catch (error) {
    await user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
  }

  res.status(HTTP_STATUS.CREATED).json({
    status: RESPONSE_STATUS.SUCCESS,
    data: { user },
    message: message,
  });
});

module.exports = { signup, resendVerification };
