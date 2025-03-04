const winston = require("winston");

const logger = winston.createLogger({
  silent: process.env.NODE_ENV === "test",
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

module.exports = logger;
