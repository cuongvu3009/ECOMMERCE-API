const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizedPermission,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router.route('/').get(authenticateUser, authorizedPermission, getAllUsers);

router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').post(authenticateUser, updateUser);
router.route('/updateUserPassword').post(authenticateUser, updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
