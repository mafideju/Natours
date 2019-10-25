/* eslint-disable no-param-reassign */
module.exports = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    res
      .status(err.statusCode)
      .json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
      });
  } else if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      res
        .status(err.statusCode)
        .json({
          status: err.status,
          message: err.message,
        });
    } else {
      // eslint-disable-next-line no-console
      console.error('ERROR => ', err);
      res
        .status(500)
        .json({
          status: 'ERROR',
          message: '>>>Deu Zebra<<<',
        });
    }
  }
};

// exports.catchAsync = (fn) => (req, res, next) => {
//   fn(req, res, next).catch(next);
// };
