const express = require('express');
const morgan = require('morgan');
const app = express();

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

app.use(express.json());
app.use(morgan('common'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
