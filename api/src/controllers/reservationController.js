// src/controllers/reservationController.js
// Routes publiques et admin liées aux réservations.
const reservationRepository = require('../repositories/reservationRepository');
const { getAvailability, createReservation, getSettingsOrThrow } = require('../services/reservationService');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { dayjs } = require('../utils/time');
const { sendEmail } = require('../utils/email');
const env = require('../config/env');

async function listAdminReservations(req, res, next) {
  try {
    const { date } = req.query;
    if (!date) {
      throw new ValidationError('Le paramètre date est requis.');
    }
    const reservations = await reservationRepository.findByDate(date);
    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
}

async function createAdminReservation(req, res, next) {
  try {
    const reservation = await createReservation({ ...req.body }, 'admin');
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
}

async function deleteReservation(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await reservationRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError('Réservation introuvable.');
    }
    res.json({ success: true, message: 'Réservation supprimée.' });
  } catch (error) {
    next(error);
  }
}

async function publicAvailability(req, res, next) {
  try {
    const { date, peopleCount } = req.query;
    const parsedCount = peopleCount ? Number.parseInt(peopleCount, 10) : undefined;
    const safeCount = Number.isInteger(parsedCount) && parsedCount > 0 ? parsedCount : 1;
    const slots = await getAvailability(date, safeCount);
    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
}

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
      data: { id: reservation.id },
    });
  } catch (error) {
    next(error);
  }
}

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
