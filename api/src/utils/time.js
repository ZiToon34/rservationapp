// src/utils/time.js
// Fonctions utilitaires pour gérer les dates en fuseau Europe/Paris.
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const PARIS_TZ = 'Europe/Paris';

/**
 * Retourne l'objet dayjs converti en fuseau Europe/Paris.
 * @param {string|Date|dayjs.Dayjs} value Valeur de date.
 * @returns {dayjs.Dayjs} Date convertie.
 */
function toParis(value) {
  return dayjs(value).tz(PARIS_TZ);
}

/**
 * Retourne la date du jour (début de journée) en Europe/Paris.
 * @returns {dayjs.Dayjs}
 */
function todayParis() {
  return dayjs().tz(PARIS_TZ).startOf('day');
}

/**
 * Convertit une date (YYYY-MM-DD) en objet dayjs au début de la journée Paris.
 * @param {string} isoDate Date au format ISO.
 * @returns {dayjs.Dayjs}
 */
function parseIsoDateParis(isoDate) {
  return dayjs.tz(isoDate, PARIS_TZ).startOf('day');
}

module.exports = {
  dayjs,
  PARIS_TZ,
  toParis,
  todayParis,
  parseIsoDateParis,
};
