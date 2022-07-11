const { isTokenValid } = require('../utils');
const { UnauthenticatedError } = require('../errors');

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

module.exports = authenticateUser;
