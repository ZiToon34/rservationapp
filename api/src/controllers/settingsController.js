// src/controllers/settingsController.js
// Gère les paramètres de capacité, horaires et jours spéciaux côté admin.
const Setting = require('../models/Setting');
const Schedule = require('../models/Schedule');
const SpecialDay = require('../models/SpecialDay');
const { ValidationError } = require('../utils/errors');
const { parseIsoDateParis, dayjs, PARIS_TZ } = require('../utils/time');
const { runPurge } = require('../jobs/purgeJob');

async function getSettings(_req, res, next) {
  try {
    const settings = await Setting.findOne();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const payload = req.body;
    if (payload.capacityMode === 'tables' && (!payload.tables || !payload.tables.length)) {
      throw new ValidationError('Merci de définir au moins une table pour ce mode.');
    }
    if (payload.capacityMode === 'total' && (!payload.totalCapacity || payload.totalCapacity < 1)) {
      throw new ValidationError('La capacité totale doit être supérieure à zéro.');
    }
    if (payload.reservationDelayMin > payload.reservationDelayMax) {
      throw new ValidationError('Le délai minimum doit être inférieur ou égal au délai maximum.');
    }
    const settings = await Setting.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function getSchedules(_req, res, next) {
  try {
    const schedules = await Schedule.find().sort({ dayOfWeek: 1 });
    res.json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
}

function ensureWindowIsOrdered(window) {
  const start = dayjs.tz(`2000-01-01T${window.start}:00`, PARIS_TZ);
  const end = dayjs.tz(`2000-01-01T${window.end}:00`, PARIS_TZ);
  if (!start.isBefore(end)) {
    throw new ValidationError('L\'heure de début doit être strictement inférieure à l\'heure de fin.');
  }
}

async function updateSchedule(req, res, next) {
  try {
    const { dayOfWeek } = req.params;
    const update = req.body;
    ensureWindowIsOrdered(update.lunch);
    ensureWindowIsOrdered(update.dinner);
    const schedule = await Schedule.findOneAndUpdate(
      { dayOfWeek: Number.parseInt(dayOfWeek, 10) },
      update,
      { new: true, upsert: true, runValidators: true },
    );
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
}

async function getSpecialDays(req, res, next) {
  try {
    const { from, to } = req.query;
    const query = {};
    const dateQuery = {};
    if (from) {
      dateQuery.$gte = parseIsoDateParis(from).toDate();
    }
    if (to) {
      dateQuery.$lte = parseIsoDateParis(to).toDate();
    }
    if (Object.keys(dateQuery).length > 0) {
      query.date = dateQuery;
    }
    const days = await SpecialDay.find(query).sort({ date: 1 });
    res.json({ success: true, data: days });
  } catch (error) {
    next(error);
  }
}

async function upsertSpecialDay(req, res, next) {
  try {
    const { date, isOpen } = req.body;
    const parsedDate = parseIsoDateParis(date).toDate();
    const day = await SpecialDay.findOneAndUpdate(
      { date: parsedDate },
      { date: parsedDate, isOpen },
      { new: true, upsert: true, runValidators: true },
    );
    res.status(201).json({ success: true, data: day });
  } catch (error) {
    next(error);
  }
}

async function deleteSpecialDay(req, res, next) {
  try {
    await SpecialDay.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Jour spécial supprimé.' });
  } catch (error) {
    next(error);
  }
}

async function manualPurge(_req, res, next) {
  try {
    await runPurge();
    res.json({ success: true, message: 'Purge lancée.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings,
  getSchedules,
  updateSchedule,
  getSpecialDays,
  upsertSpecialDay,
  deleteSpecialDay,
  manualPurge,
};
