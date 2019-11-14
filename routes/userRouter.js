const express = require('express');
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('./../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('./../controllers/authController');
const { updateCurrentUser } = require('./../controllers/userController');
// const catchAsync = require('./../service/catchAsync');

const router = express.Router();

router
  .post('/signup', signup);
router
  .post('/login', login);
router
  .post('/forgotPassword', forgotPassword);
router
  .patch('/resetPassword/:token', resetPassword);
router
  .patch('/updatePassword', protect, updatePassword);
router
  .patch('/updateCurrentUser', protect, updateCurrentUser);

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
