// src/middlewares/errorHandler.js
// Centralise la gestion des erreurs en réponse JSON lisible pour le client.
const { ApplicationError } = require('../utils/errors');
const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  const status = err instanceof ApplicationError ? err.statusCode : 500;
  const message = err instanceof ApplicationError ? err.message : 'Erreur interne inattendue.';

  if (status >= 500) {
    logger.error({ err }, 'Erreur serveur');
  } else {
    logger.warn({ err }, 'Erreur contrôlée');
  }

  res.status(status).json({
    success: false,
    message,
    code: err.code || 'SERVER_ERROR',
    details: err.details || undefined,
  });
}

module.exports = errorHandler;
