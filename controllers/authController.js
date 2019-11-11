/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const AppError = require('./../service/AppError');
const catchAsync = require('./../service/catchAsync');


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

exports.protect = catchAsync(async (req, res, next) => {
  // 1 => VERIFICAR SE O TOKEN EXISTE
  // => SPLITAR DO BEARER SE EXISTE, SENÃO THROW ERROR
  let token;
  if (
    req.headers.authorization
      && req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Operação não Autorizada. Faça Login para continuar', 401));
  }
  // 2 => VERIFICAR VALIDADE DO TOKEN E SE HOUVE ALTERAÇÃO(SENHA)
  const decodedData = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 => CHECAR SE O USER EXISTE
  const freshUser = await User.findById(decodedData.id);
  if (!freshUser) {
    return next(new AppError('Token de acesso não reconhecido. Faça login novamente.', 401));
  }

  // 4 => CHECAR SE O USER ALTEROU PASSWORD (USERMODEL)
  if (freshUser.changedPasswordAfter(decodedData.iat)) {
    return next(new AppError('Password Mudou. Login Novamente.', 401));
  }

  req.user = freshUser;
  next();
});

exports.restrict = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('Para acessar este recurso é necessária a permissão de administrador', 403),
    );
  }
  next();
};
