const {logger} = require('./logEvents.js')


const errorHandler = (err, req, res, next) => {
    const message = `${err.name}: ${err.message}\t ${req.method}\t ${req.url}\t ${req.headers.origin}`;
    logger(message, 'errorLog.log')

    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status);
    res.json({ message: err.message });

}

module.exports = errorHandler;

