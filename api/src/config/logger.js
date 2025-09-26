// src/config/logger.js
// Définit un logger pino configuré pour l'application.
const pino = require('pino');
const env = require('./env');

const logger = pino({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  transport: env.nodeEnv === 'production'
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
});

module.exports = logger;
