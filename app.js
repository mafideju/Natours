const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('common'));
}
app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'FAIL',
    message: `Página ${req.originalUrl} Não Encontrada.`,
  });
});
// app.use(express.static(`${__dirname}/public`));

module.exports = app;
