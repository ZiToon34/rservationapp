// src/routes/authRoutes.js
// Routes d'authentification administrateur (register pour seed, login, logout).
const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { registerBody, loginBody } = require('./schemas');
const { loginLimiter } = require('../middlewares/rateLimiter');
const env = require('../config/env');

const router = express.Router();

// POST /auth/register (à utiliser uniquement en développement)
router.post('/register', validate({ body: registerBody }), (req, res, next) => {
  if (env.nodeEnv === 'production') {
    res.status(403).json({
      success: false,
      message: 'Création d\'admin interdite en production. Utilisez un script de seed sécurisé.',
    });
    return;
  }
  register(req, res, next);
});

// POST /auth/login
router.post('/login', loginLimiter, validate({ body: loginBody }), login);

// POST /auth/logout
router.post('/logout', logout);

module.exports = router;
