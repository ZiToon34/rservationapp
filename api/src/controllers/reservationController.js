// src/controllers/reservationController.js
// Routes publiques et admin liées aux réservations.
const Reservation = require('../models/Reservation');
const { getAvailability, createReservation, getSettingsOrThrow } = require('../services/reservationService');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { parseIsoDateParis, dayjs } = require('../utils/time');
const { sendEmail } = require('../utils/email');
const env = require('../config/env');

/**
 * Retourne la liste des réservations pour un jour (admin).
 */
async function listAdminReservations(req, res, next) {
  try {
    const { date } = req.query;
    if (!date) {
      throw new ValidationError('Le paramètre date est requis.');
    }
    const dateParis = parseIsoDateParis(date);
    const reservations = await Reservation.find({ date: dateParis.toDate() }).sort({ time: 1 });
    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
}

/**
 * Crée une réservation côté admin en respectant les règles métiers.
 */
async function createAdminReservation(req, res, next) {
  try {
    const reservation = await createReservation({ ...req.body }, 'admin');
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
}

/**
 * Supprime une réservation.
 */
async function deleteReservation(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundError('Réservation introuvable.');
    }
    res.json({ success: true, message: 'Réservation supprimée.' });
  } catch (error) {
    next(error);
  }
}

/**
 * Donne les créneaux publics disponibles pour un jour.
 */
async function publicAvailability(req, res, next) {
  try {
    const { date, peopleCount } = req.query;
    const count = typeof peopleCount === 'number' ? peopleCount : 1;
    const slots = await getAvailability(date, count);
    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
}

/**
 * Crée une réservation publique et envoie un e-mail de confirmation.
 */
async function publicCreate(req, res, next) {
  try {
    const reservation = await createReservation({ ...req.body }, 'client');
    const settings = await getSettingsOrThrow();
    await sendEmail({
      to: reservation.email,
      subject: 'Confirmation de réservation – Votre restaurant',
      html: buildConfirmationEmail({ reservation, settings }),
    });
    res.status(201).json({
      success: true,
      message: 'Réservation confirmée ! Un e-mail vient de vous être envoyé.',
      data: { id: reservation._id.toString() },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Génère le HTML de confirmation envoyé au client.
 * @param {{ reservation: import('../models/Reservation'), settings: import('../models/Setting') }} param0
 * @returns {string}
 */
function buildConfirmationEmail({ reservation }) {
  const dateFormat = dayjs(reservation.date).format('DD/MM/YYYY');
  return `
    <div style="font-family: Arial, sans-serif; color:#333;">
      <h1 style="color:#b22222;">Confirmation de réservation</h1>
      <p>Bonjour ${reservation.name},</p>
      <p>Nous confirmons votre réservation au restaurant :</p>
      <ul>
        <li><strong>Date :</strong> ${dateFormat}</li>
        <li><strong>Heure :</strong> ${reservation.time}</li>
        <li><strong>Nombre de personnes :</strong> ${reservation.peopleCount}</li>
      </ul>
      <p>Coordonnées fournies : ${reservation.email} / ${reservation.phone}</p>
      <p>Nous avons hâte de vous accueillir !</p>
      <p style="font-size: 0.9rem; color:#666;">Besoin de modifier ? Contactez-nous par téléphone.</p>
      <p>— L'équipe du restaurant</p>
      <p style="font-size: 0.8rem; color:#999;">Ce message provient de ${env.clientUrl}</p>
    </div>
  `;
}

module.exports = {
  listAdminReservations,
  createAdminReservation,
  deleteReservation,
  publicAvailability,
  publicCreate,
};
