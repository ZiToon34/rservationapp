// src/config/database.js
// Vérifie la connexion PostgreSQL.
const { pool } = require('../db');
const logger = require('./logger');

/**
 * Initialise la connexion à PostgreSQL en effectuant une requête simple.
 * @returns {Promise<void>} Promesse résolue quand la connexion est validée.
 */
async function connectDatabase() {
  try {
    await pool.query('SELECT 1');
    logger.info('✅ Connexion PostgreSQL réussie');
  } catch (error) {
    logger.error({ err: error }, '❌ Échec de connexion PostgreSQL');
    throw error;
  }
}

module.exports = {
  connectDatabase,
};
