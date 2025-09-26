// src/server.js
// Point d'entrée : lance la connexion Mongo et démarre le serveur HTTP.
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDatabase } = require('./config/database');
const { schedulePurgeJob } = require('./jobs/purgeJob');

(async () => {
  try {
    await connectDatabase();
    schedulePurgeJob();

    app.listen(env.port, () => {
      logger.info(`🚀 API prête sur le port ${env.port}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Impossible de démarrer le serveur');
    process.exit(1);
  }
})();
