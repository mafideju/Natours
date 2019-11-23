const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

const AppError = require('./service/AppError');
const errorHandler = require('./service/errorHandlers');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('common'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Muitas solicitações da mesma origem. Tente novamente em uma hora.',
});
app.use('/api', limiter);
app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  // console.log('HEADERS => ', req.headers);
  next();
});
app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`404 - |NOT FOUND| => Página ${req.originalUrl} Não Encontrada.`));
});

app.use(errorHandler);
// app.use(express.static(`${__dirname}/public`));

module.exports = app;
