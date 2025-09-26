// src/middlewares/auth.js
// Vérifie le token JWT d'un administrateur.
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { AuthError } = require('../utils/errors');
const adminRepository = require('../repositories/adminRepository');

async function adminAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AuthError("Token d'authentification manquant.");
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await adminRepository.findById(payload.sub);

    if (!admin) {
      throw new AuthError('Administrateur introuvable.');
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
    };
    next();
  } catch (error) {
    next(new AuthError('Authentification invalide. Merci de vous reconnecter.'));
  }
}

module.exports = adminAuth;
