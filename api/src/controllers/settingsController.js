// src/controllers/settingsController.js
// Gère les paramètres de capacité, horaires et jours spéciaux côté admin.
const settingsRepository = require('../repositories/settingsRepository');
const scheduleRepository = require('../repositories/scheduleRepository');
const specialDayRepository = require('../repositories/specialDayRepository');
const { ValidationError } = require('../utils/errors');
const { parseIsoDateParis } = require('../utils/time');
const { runPurge } = require('../jobs/purgeJob');

async function getSettings(_req, res, next) {
  try {
    const settings = await settingsRepository.getSettings();
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
    const settings = await settingsRepository.upsertSettings(payload);
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function getSchedules(_req, res, next) {
  try {
    const schedules = await scheduleRepository.getAll();
    res.json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
}

function ensureWindowIsOrdered(window) {
  const start = window.start;
  const end = window.end;
  if (start >= end) {
    throw new ValidationError("L'heure de début doit être strictement inférieure à l'heure de fin.");
  }
}

async function updateSchedule(req, res, next) {
  try {
    const { dayOfWeek } = req.params;
    const update = req.body;
    ensureWindowIsOrdered(update.lunch);
    ensureWindowIsOrdered(update.dinner);
    const schedule = await scheduleRepository.upsert(Number.parseInt(dayOfWeek, 10), update);
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
}

async function getSpecialDays(req, res, next) {
  try {
    const { from, to } = req.query;
    const days = await specialDayRepository.findRange(from, to);
    res.json({ success: true, data: days });
  } catch (error) {
    next(error);
  }
}

async function upsertSpecialDay(req, res, next) {
  try {
    const { date, isOpen } = req.body;
    const parsedDate = parseIsoDateParis(date).format('YYYY-MM-DD');
    const day = await specialDayRepository.upsert(parsedDate, isOpen);
    res.status(201).json({ success: true, data: day });
  } catch (error) {
    next(error);
  }
}

async function deleteSpecialDay(req, res, next) {
  try {
    await specialDayRepository.deleteById(req.params.id);
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

