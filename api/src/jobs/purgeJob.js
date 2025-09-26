// src/jobs/purgeJob.js
// Tâche planifiée à 03h (Europe/Paris) pour nettoyer les anciennes données.
const cron = require('node-cron');
const reservationRepository = require('../repositories/reservationRepository');
const specialDayRepository = require('../repositories/specialDayRepository');
const { todayParis } = require('../utils/time');
const logger = require('../config/logger');

async function runPurge() {
  const today = todayParis().format('YYYY-MM-DD');
  await reservationRepository.deleteBefore(today);
  await specialDayRepository.deleteBefore(today);
  logger.info('🧹 Purge quotidienne réalisée');
}

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
