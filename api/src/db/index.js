// src/db/index.js
// Initialise le pool PostgreSQL et expose un utilitaire de requête.
const { Pool } = require('pg');
const env = require('../config/env');
const logger = require('../config/logger');

if (!env.databaseUrl) {
  logger.warn('⚠️  DATABASE_URL est vide : configurez votre connexion PostgreSQL.');
}

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl && env.databaseUrl.includes('render.com')
    ? { rejectUnauthorized: false }
    : undefined,
});

pool.on('error', (error) => {
  logger.error({ err: error }, 'Erreur inattendue du pool PostgreSQL');
});

/**
 * Exécute une requête SQL sur la base PostgreSQL.
 * @param {string} text SQL paramétré.
 * @param {Array<unknown>} params Valeurs des paramètres.
 */
async function query(text, params = []) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};
