const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;
const { format } = require('date-fns');
const fsPromises = require('fs').promises;

const logEvents = async (MessageChannel, logFileName) => {
    const dateTime = format(new Date(), 'dd.MM.yyyy - HH.mm.ss');
    const logItem = `${dateTime}\t${uuid()}\t${MessageChannel}`;

    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName),logItem);
    }
    catch(err){
        console.log(err);
    }
}

const logger = (req, res, next) => {
    const message = `${req.method}\t${req.url}\t{req.headers.origin}`;

    logEvents(message, 'regLog.log');
    next();
}

module.exports = {logEvents, logger};