// src/utils/email.js
// Gère l'envoi d'e-mails de confirmation avec un fallback console en développement.
const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../config/logger');

let transporter;

if (env.smtp.host && env.smtp.user && env.smtp.pass) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
} else {
  logger.warn('⚠️  SMTP non configuré : les e-mails seront affichés dans la console.');
}

/**
 * Envoie un e-mail de confirmation de réservation.
 * @param {object} options
 * @param {string} options.to Destination.
 * @param {string} options.subject Objet du mail.
 * @param {string} options.html Contenu HTML.
 * @returns {Promise<void>}
 */
async function sendEmail({ to, subject, html }) {
  if (!transporter) {
    logger.info({ to, subject }, '✉️ E-mail simulé (SMTP absent)');
    logger.debug(html);
    return;
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
  });
}

module.exports = {
  sendEmail,
};
