/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cada Pacote Deve Ter um Nome'],
    unique: true,
    trim: true,
    maxlength: [30, 'Nome de Pacote Deve Ter no Máximo 30 Caracteres'],
    minlength: [5, 'Nome de Pacote Deve Ter no Minimo 5 Caracteres'],
    // validate: [validator.isAlpha, 'Nome de Pacote Deve Ter Apenas Letras'],
  },
  slug: String,
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
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Dificuldade Deve Ser \'easy\', \'medium\' ou \'difficult\'.',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [0, 'Avaliação Mínima: 0.0'],
    max: [5, 'Avaliação Máxima: 5.0'],
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
    validate: {
      validator(val) {
        return val < this.price;
      },
      message: 'Desconto Deve Ser Menor que o Preço do Pacote',
    },
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
  secretTour: {
    type: Boolean,
    default: false,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// CRIAÇÃO DE UM CAMPO A PARTIR DE OUTROS (CALCULOS)
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

// DOCUMENT MIDDLEWARE ** SAVE OR CREATE **
tourSchema
  .pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

// tourSchema
//   .post('save', (doc, next) => {
//     console.log(doc);
//     next();
//   });

// QUERY MIDDLEWARE ** FINDS **
// tourSchema
//   .pre(/^find/, function (next) {
//     this.find({ secretTour: { $ne: true } });
//     next();
//   });


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// https://www.xnxx.com/video-ucx0na9/family_brasil_swing_submissa_mae
