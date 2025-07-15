const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, 'logs.txt');

module.exports = (req, res, next) => {
  res.on('finish', () => {
    const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode}\n`;

    // Async logging (non-blocking)
    fs.appendFile(logFilePath, log, (err) => {
      if (err) console.error('Error writing log:', err);
    });
  });

  next();
};
