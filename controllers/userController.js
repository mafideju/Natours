const User = require('./../models/userModel');
const AppError = require('./../service/AppError');
const catchAsync = require('./../service/catchAsync');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  try {
    res.status(200).json({
      status: 'SUCCESS',
      data: { users },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  try {
    res.status(200).json({
      status: 'SUCCESS',
      data: { user },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'SUCCESS',
      data: {
        tour: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'SUCCESS',
      data: { user },
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'SUCCESS',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAIL',
      message: err,
    });
  }
};

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Não use esta rota para atualizar a senha.', 400),
    );
  }

  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((field) => {
      if (allowedFields.includes(field)) {
        newObj[field] = obj[field];
      } else {
        next(
          new AppError('Você está atualizando um campo não permitido', 400),
        );
      }
    });
    return newObj;
  };

  const filteredData = filterObj(req.body, 'username', 'email');

  const updateUserData = await User.findByIdAndUpdate(req.user.id, filteredData, {
    new: true,
    runValidators: true,
  });

  res
    .status(200)
    .json({
      status: 'SUCCESS',
      data: { user: updateUserData },
    });
});

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res
    .status(204)
    .json({
      status: 'SUCCESS',
      data: null,
    });
});
