/* eslint-disable func-names */
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cada Pacote Deve Ter um Nome'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Cada Pacote Deve Ter uma Duração em Dias'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Cada Pacote Deve Ter um Tamanho para o Grupo'],
  },
  difficulty: {
    type: String,
    required: [true, 'Cada Pacote Deve Ter uma Dificuldade'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Cada Pacote Deve Ter um Preço'],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Cada Pacote Deve Apresentar Uma Descrição'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Cada Pacote Deve Apresentar Uma Imagem de Apresentação'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

tourSchema
  .virtual('durationWeeks')
  .get(function () {
    return this.duration / 7;
  });

tourSchema
  .virtual('durationHours')
  .get(function () {
    return this.duration * 24;
  });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
