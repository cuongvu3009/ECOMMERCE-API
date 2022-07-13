const User = require('../models/User');
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');

  res.status(200).json({
    users,
  });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).select('-password');
  if (!user) {
    throw new NotFoundError(`No user with Id ${id} found`);
  }

  checkPermissions(req.user, user._id);
  res.status(200).json(user);
};

const showCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError('Please provide name and email');
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );
  const tokenUser = await createTokenUser(user);
  await attachCookiesToResponse({ res, user: tokenUser });
  res.status(200).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError(
      'Please provide your old password and new password'
    );
  }

  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Wrong password! Try again');
  }
  user.password = newPassword;
  //	need save when we updating new or existing document
  await user.save();
  res.status(200).json({ msg: 'Password updated!' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
