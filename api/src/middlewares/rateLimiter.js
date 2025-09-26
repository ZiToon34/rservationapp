// src/middlewares/rateLimiter.js
// Définit des limites de requêtes pour protéger les points sensibles.
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Réessayez dans une minute.',
  },
});

const reservationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de demandes de réservation. Patientez un instant.',
  },
});

module.exports = {
  loginLimiter,
  reservationLimiter,
};
