// src/controllers/publicController.js
// Donne accès à certaines informations publiques (paramètres et calendrier d'ouverture).
const Setting = require('../models/Setting');
const Schedule = require('../models/Schedule');
const SpecialDay = require('../models/SpecialDay');
const { parseIsoDateParis, todayParis } = require('../utils/time');
const { NotFoundError } = require('../utils/errors');

async function getPublicSettings(_req, res, next) {
  try {
    const settings = await Setting.findOne();
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

    const schedules = await Schedule.find().sort({ dayOfWeek: 1 });
    const specialDays = await SpecialDay.find({
      date: {
        $gte: start.toDate(),
        $lte: end.toDate(),
      },
    }).sort({ date: 1 });

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
