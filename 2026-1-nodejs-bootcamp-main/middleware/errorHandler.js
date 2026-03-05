const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, ) => {
  // Hatayı logla
  const errorMessage = `${err.name}: ${err.message}\t${req.method}\t${req.headers.origin}`;
  logEvents(errorMessage, 'errLog.log');

  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status);

  res.json({
    message: err.message,
  });
};

module.exports = errorHandler;
