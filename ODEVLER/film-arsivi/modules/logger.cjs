const fs = require('fs');

function logger(message, level = 'info', timestamp = new Date(), url = '') {
    const logMessage = `[${timestamp.toISOString()}] [${level.toUpperCase()}] ${message} ${url ? '- URL: ' + url : ''}\n`;
    fs.appendFile('./logs/app.log', logMessage, (err) => {
        if (err) {
            console.error('Log yazma hatası:', err);
        }
    });
}

module.exports = logger;