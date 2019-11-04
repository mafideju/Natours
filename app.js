const express = require('express');
const morgan = require('morgan');

const app = express();

const AppError = require('./service/AppError');
const errorHandler = require('./service/errorHandlers');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('common'));
}
app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  // console.log('HEADERS => ', req.headers);
  next();
});
app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`NOT FOUND => Página ${req.originalUrl} Não Encontrada.`));
});

app.use(errorHandler);
// app.use(express.static(`${__dirname}/public`));

module.exports = app;
