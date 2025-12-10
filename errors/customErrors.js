const errorFactory = require('./errorFactory');
const HTTP_STATUS = require('../constants/httpStatus');
const HTTP_MESSAGES = require('../constants/httpMessages');
const ERROR_TYPES = require('../constants/errorTypes');

// 4xx Client Errors
const BadRequestError = errorFactory(HTTP_STATUS.BAD_REQUEST, ERROR_TYPES.BAD_REQUEST, HTTP_MESSAGES.BAD_REQUEST);

const AuthenticationError = errorFactory(
  HTTP_STATUS.UNAUTHORIZED,
  ERROR_TYPES.AUTHENTICATION_FAILED,
  HTTP_MESSAGES.UNAUTHORIZED,
);

const ForbiddenError = errorFactory(HTTP_STATUS.FORBIDDEN, ERROR_TYPES.FORBIDDEN, HTTP_MESSAGES.FORBIDDEN);

const NotFoundError = errorFactory(HTTP_STATUS.NOT_FOUND, ERROR_TYPES.NOT_FOUND, HTTP_MESSAGES.NOT_FOUND);

const ConflictError = errorFactory(HTTP_STATUS.CONFLICT, ERROR_TYPES.CONFLICT, HTTP_MESSAGES.CONFLICT);

const ValidationError = errorFactory(
  HTTP_STATUS.UNPROCESSABLE_ENTITY,
  ERROR_TYPES.VALIDATION_ERROR,
  HTTP_MESSAGES.UNPROCESSABLE_ENTITY,
);

const TooManyRequestsError = errorFactory(
  HTTP_STATUS.TOO_MANY_REQUESTS,
  ERROR_TYPES.TOO_MANY_REQUESTS,
  HTTP_MESSAGES.TOO_MANY_REQUESTS,
);

const PayloadTooLargeError = errorFactory(
  HTTP_STATUS.PAYLOAD_TOO_LARGE,
  ERROR_TYPES.PAYLOAD_TOO_LARGE,
  HTTP_MESSAGES.PAYLOAD_TOO_LARGE,
);

const RequestTimeoutError = errorFactory(
  HTTP_STATUS.REQUEST_TIMEOUT,
  ERROR_TYPES.REQUEST_TIMEOUT,
  HTTP_MESSAGES.REQUEST_TIMEOUT,
);

// 5xx Server Errors
const InternalServerError = errorFactory(
  HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ERROR_TYPES.INTERNAL_SERVER_ERROR,
  HTTP_MESSAGES.INTERNAL_SERVER_ERROR,
);

const ServiceUnavailableError = errorFactory(
  HTTP_STATUS.SERVICE_UNAVAILABLE,
  ERROR_TYPES.SERVICE_UNAVAILABLE,
  HTTP_MESSAGES.SERVICE_UNAVAILABLE,
);

module.exports = {
  BadRequestError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  PayloadTooLargeError,
  RequestTimeoutError,
  InternalServerError,
  ServiceUnavailableError,
};
