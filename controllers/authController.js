/* eslint-disable prefer-destructuring */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const AppError = require('./../service/AppError');
const catchAsync = require('./../service/catchAsync');
const sendEmail = require('./../service/eMail');


const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES,
});

exports.signup = catchAsync(async (req, res) => {
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
});

exports.login = catchAsync(async (req, res, next) => {
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
});

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('Email Não Encontrado', 404),
    );
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Resete sua Senha!',
      message: `Para resetar sua senha clique no link\n${resetURL}\nEstamos em Construção!!!`,
    });

    res
      .status(200)
      .json({
        status: 'SUCCESS',
        message: 'Token enviado para seu email!',
      });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        `Não foi possível enviar o email para recriar a senha. Tente novamente. Erro: ${err}`, 500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token inválido ou expirado.', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signToken(user._id);
  res
    .status(200)
    .json({
      status: 'SUCCESS',
      token,
    });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // GET USER FROM COLLECTION
  const user = await User.findById(req.user.id).select('+password');

  // CHECK PASSWORDS
  if (!(await user.correctPassword(req.body.passwordConfirm, user.password))) {
    return next(
      new AppError('Senhas Não Conferem. Tente Novamente.', 401),
    );
  }

  // update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log In User
  const token = signToken(user._id);
  res
    .status(201)
    .json({
      status: 'SUCCESS',
      token,
    });
});
