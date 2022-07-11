const User = require('../models/User');
const { BadRequestError, NotFoundError } = require('../errors');

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
  res.status(200).json(user);
};

const showCurrentUser = async (req, res) => {
  res.send('show current user');
};

const updateUser = async (req, res) => {
  res.send('update user');
};

const updateUserPassword = async (req, res) => {
  res.send('update user password');
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
