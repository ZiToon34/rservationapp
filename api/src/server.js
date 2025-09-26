// src/server.js
// Point d'entree : verifie la connexion PostgreSQL et demarre le serveur HTTP.
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
      logger.info(`[API] Serveur demarre sur le port ${env.port}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Impossible de demarrer le serveur');
    process.exit(1);
  }
})();
