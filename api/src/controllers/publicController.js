// src/controllers/publicController.js
// Donne accès à certaines informations publiques (paramètres et calendrier d'ouverture).
const settingsRepository = require('../repositories/settingsRepository');
const scheduleRepository = require('../repositories/scheduleRepository');
const specialDayRepository = require('../repositories/specialDayRepository');
const { parseIsoDateParis, todayParis } = require('../utils/time');
const { NotFoundError } = require('../utils/errors');

async function getPublicSettings(_req, res, next) {
  try {
    const settings = await settingsRepository.getSettings();
    if (!settings) {
      throw new NotFoundError('Paramètres indisponibles.');
    }
    res.json({
      success: true,
      data: {
        maxPeoplePerReservation: settings.maxPeoplePerReservation,
        reservationDelayMin: settings.reservationDelayMin,
        reservationDelayMax: settings.reservationDelayMax,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getPublicCalendar(req, res, next) {
  try {
    const { from, to } = req.query;
    const start = from ? parseIsoDateParis(from) : todayParis();
    const end = to ? parseIsoDateParis(to) : start.add(30, 'day');

    const schedules = await scheduleRepository.getAll();
    const specialDays = await specialDayRepository.findRange(
      start.format('YYYY-MM-DD'),
      end.format('YYYY-MM-DD'),
    );

    res.json({
      success: true,
      data: {
        schedules,
        specialDays,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicSettings,
  getPublicCalendar,
};
