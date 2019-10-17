const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Usuário Deve Ter Um Apelido'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Usuário Deve Ter Um Email Válido'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Usuário Deve Cadastrar Uma Senha'],
    trim: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
