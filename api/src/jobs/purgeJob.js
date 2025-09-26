// src/jobs/purgeJob.js
// Tâche planifiée à 03h (Europe/Paris) pour nettoyer les anciennes données.
const cron = require('node-cron');
const Reservation = require('../models/Reservation');
const SpecialDay = require('../models/SpecialDay');
const { todayParis } = require('../utils/time');
const logger = require('../config/logger');

/**
 * Exécute la purge immédiate.
 */
async function runPurge() {
  const today = todayParis().toDate();
  const reservationsDeleted = await Reservation.deleteMany({ date: { $lt: today } });
  const specialDaysDeleted = await SpecialDay.deleteMany({ date: { $lt: today } });
  logger.info(
    {
      reservations: reservationsDeleted.deletedCount,
      specialDays: specialDaysDeleted.deletedCount,
    },
    '🧹 Purge quotidienne réalisée',
  );
}

/**
 * Programme l'exécution à 03:00 Europe/Paris.
 */
function schedulePurgeJob() {
  cron.schedule('0 3 * * *', async () => {
    try {
      await runPurge();
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors de la purge planifiée');
    }
  }, {
    timezone: 'Europe/Paris',
  });
}

module.exports = {
  schedulePurgeJob,
  runPurge,
};
