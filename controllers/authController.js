const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../service/AppError');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES,
});

exports.signup = async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res
    .status(201)
    .json({
      status: 'SUCCESS',
      token,
      data: {
        user: newUser,
      },
    });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new AppError('Forneça um Email Cadastrado para Logar', 400));
  } if (!password) {
    return next(new AppError('Forneça uma Senha Válida para Logar', 400));
  }


  const user = await User
    .findOne({ email })
    .select('+password');
  const correct = await user
    .correctPassword(password, user.password);

  const token = signToken(user.id);
  if (!user || !correct) {
    return next(new AppError('Usuário ou Senha Incorretos. Tente Novamente!', 401));
  }
  res
    .status(200)
    .json({
      status: 'SUCCESS',
      token,
    });
};