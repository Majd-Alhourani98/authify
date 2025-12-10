const HTTP_STATUS = require('../constants/httpStatus');
const ERROR_TYPES = require('../constants/errorTypes');
const RESPONSE_STATUS = require('../constants/responseStatus');

class AppError extends Error {
  constructor(
    message,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code = ERROR_TYPES.INTERNAL_SERVER_ERROR,
    isOperational = true,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? RESPONSE_STATUS.FAIL : RESPONSE_STATUS.ERROR;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
