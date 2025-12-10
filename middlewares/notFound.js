const { NotFoundError } = require('../errors/customErrors');

module.exports = (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
};
