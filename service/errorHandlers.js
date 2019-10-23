/* eslint-disable no-param-reassign */

module.exports = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res
    .status(err.statusCode)
    .json({
      status: err.status,
      message: err.message,
    });
};

// exports.catchAsync = (fn) => (req, res, next) => {
//   fn(req, res, next).catch(next);
// };
