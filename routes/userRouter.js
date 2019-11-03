const express = require('express');
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('./../controllers/userController');
const { signup, login } = require('./../controllers/authController');
const catchAsync = require('./../service/catchAsync');

const router = express.Router();

router
  .post('/signup', catchAsync(signup));

router
  .post('/login', catchAsync(login));

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
