const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Usuário Deve Cadastrar Uma Senha com 6 Caracteres no Minimo'],
    minlength: 6,
    select: false,
    validate(password) {
      if (
        password.includes('password')
      || password.includes('123456')
      || password.includes('000000')
      ) throw new Error('Senha Manjada. Tente Outra.');
    },
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
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  photo: {
    type: String,
    trim: true,
  },
});

userSchema
  .pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });

userSchema
  .pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

userSchema
  .methods
  .correctPassword = async function (candidatePassword, userPassword) {
    const comparation = await bcrypt.compare(candidatePassword, userPassword);
    return comparation;
  };

userSchema
  .methods
  .changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimeStamp;
    }
    return false;
  };

userSchema
  .methods
  .createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };

const User = mongoose.model('User', userSchema);

module.exports = User;
