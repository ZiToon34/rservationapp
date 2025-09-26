// src/config/env.js
// Gestion centralisée de la configuration d'environnement.
const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  clientUrl: process.env.CLIENT_URL || '*',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number.parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'reservation@example.com',
  },
};

if (!env.databaseUrl) {
  console.warn('⚠️  DATABASE_URL est vide. Configurez la connexion PostgreSQL avant de lancer l\'API.');
}

if (!env.jwtSecret) {
  console.warn('⚠️  JWT_SECRET est vide. Les tokens ne seront pas sécurisés sans cette valeur.');
}

module.exports = env;
