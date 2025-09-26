// src/middlewares/auth.js
// Vérifie le token JWT d'un administrateur.
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { AuthError } = require('../utils/errors');
const Admin = require('../models/Admin');

/**
 * Middleware qui exige un JWT valide et ajoute l'admin dans req.admin.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function adminAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AuthError('Token d\'authentification manquant.');
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.sub);

    if (!admin) {
      throw new AuthError('Administrateur introuvable.');
    }

    req.admin = {
      id: admin._id.toString(),
      email: admin.email,
    };
    next();
  } catch (error) {
    next(new AuthError('Authentification invalide. Merci de vous reconnecter.'));
  }
}

module.exports = adminAuth;
