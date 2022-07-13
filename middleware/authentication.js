const { isTokenValid } = require('../utils');
const { UnauthenticatedError, UnauthorizedError } = require('../errors');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError('Authentication invalid!');
  }

  try {
    const user = isTokenValid({ token });
    req.user = { name: user.name, userId: user.userId, role: user.role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid!');
  }
};

const authorizedPermission = async (req, res, next) => {
  if (req.user.role === 'user') {
    throw new UnauthorizedError('You are not allow to do this!');
  }

  next();
};

module.exports = { authenticateUser, authorizedPermission };
