// src/config/database.js
// Initialise la connexion MongoDB via Mongoose.
const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

/**
 * Initialise la connexion à MongoDB.
 * @returns {Promise<void>} Promesse résolue quand la connexion est prête.
 */
async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('✅ Connexion MongoDB réussie');
  } catch (error) {
    logger.error({ err: error }, '❌ Échec de connexion MongoDB');
    throw error;
  }
}

module.exports = {
  connectDatabase,
};
