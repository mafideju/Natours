const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour Must Have a Name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Tour Must Have a Duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour Must Have a Group Size'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour Must Have a Hardness'],
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
    required: [true, 'Tour Must Have a Price'],
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
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
