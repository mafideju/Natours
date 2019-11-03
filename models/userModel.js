/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Usuário Deve Ter Um Nome ou Apelido'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Usuário Deve Ter Um Email Válido'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Usuário Deve Ter Um Email Válido'],
  },
  password: {
    type: String,
    required: [true, 'Usuário Deve Cadastrar Uma Senha com 6 Caracteres no Minimo'],
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Senhas Devem Ser Iguais'],
    validate: {
      validator(passwordConfirm) {
        return passwordConfirm === this.password;
      },
      message: 'Senhas Devem Ser Iguais',
    },
  },
  photo: {
    type: String,
    trim: true,
  },
});

userSchema
  // eslint-disable-next-line func-names
  .pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });

const User = mongoose.model('User', userSchema);

module.exports = User;
