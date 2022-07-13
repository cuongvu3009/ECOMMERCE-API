const User = require('../models/User');
const { CustomError, BadRequestError } = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const login = async (req, res) => {
  //	check if email exist
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  //	check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError('User do not exist!');
  }
  //	check if password correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError('Password is not correct !');
  }
  const tokenUser = createTokenUser(user);
  await attachCookiesToResponse({ res, user: tokenUser });

  res.status(200).json({ user: tokenUser });
};
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(200).json('User has been logged out!');
};

const register = async (req, res) => {
  const { email, name, password } = req.body;

  //	check if email used
  const userEmail = await User.findOne({ email });
  if (userEmail) {
    throw new BadRequestError('This email is already used!');
  }

  //	first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ email, name, password, role });

  //	create token
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(201).json({ user: tokenUser });
};

module.exports = { login, logout, register };
