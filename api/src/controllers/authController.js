// src/controllers/authController.js
// Gère l'inscription (seed), la connexion et la déconnexion logique pour les admins.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/adminRepository');
const env = require('../config/env');
const { ValidationError, AuthError } = require('../utils/errors');

const SALT_ROUNDS = 10;

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const existing = await adminRepository.findByEmail(email);
    if (existing) {
      throw new ValidationError('Un compte existe déjà avec cet e-mail.');
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const admin = await adminRepository.create({ email, passwordHash });
    res.status(201).json({
      success: true,
      message: 'Administrateur créé.',
      data: { id: admin.id, email: admin.email },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new AuthError('Identifiants incorrects.');
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      throw new AuthError('Identifiants incorrects.');
    }

    const token = jwt.sign(
      {
        sub: admin.id,
        email: admin.email,
      },
      env.jwtSecret,
      { expiresIn: '24h' },
    );

    res.json({
      success: true,
      message: 'Connexion réussie.',
      data: {
        token,
        admin: { id: admin.id, email: admin.email },
      },
    });
  } catch (error) {
    next(error);
  }
}

function logout(_req, res) {
  res.json({ success: true, message: 'Déconnexion effectuée côté client.' });
}

module.exports = {
  register,
  login,
  logout,
};
