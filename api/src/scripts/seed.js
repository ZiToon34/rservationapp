// src/scripts/seed.js
// Script d'initialisation : crée un admin, des paramètres et des horaires par défaut.
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { connectDatabase } = require('../config/database');
const Admin = require('../models/Admin');
const Setting = require('../models/Setting');
const Schedule = require('../models/Schedule');
const logger = require('../config/logger');

const SALT_ROUNDS = 10;

async function seed() {
  await connectDatabase();

  // Création admin par défaut
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'durand.olivier.34@icloud.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || '11062015Ro.';

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    await Admin.create({ email: adminEmail, passwordHash });
    logger.info(`✅ Admin créé : ${adminEmail} / ${adminPassword}`);
  } else {
    logger.info('ℹ️  Admin déjà présent, aucune action.');
  }

  // Paramètres généraux
  const existingSettings = await Setting.findOne();
  if (!existingSettings) {
    await Setting.create({
      capacityMode: 'total',
      totalCapacity: 40,
      maxPeoplePerReservation: 6,
      reservationDelayMin: 2,
      reservationDelayMax: 720,
      tables: [
        { tableNumber: 1, seats: 2 },
        { tableNumber: 2, seats: 2 },
        { tableNumber: 3, seats: 4 },
        { tableNumber: 4, seats: 4 },
        { tableNumber: 5, seats: 6 },
      ],
    });
    logger.info('✅ Paramètres par défaut créés.');
  }

  // Horaires semaine
  const existingSchedules = await Schedule.countDocuments();
  if (existingSchedules === 0) {
    const days = Array.from({ length: 7 }, (_, dayOfWeek) => ({
      dayOfWeek,
      lunch: { start: '12:00', end: '14:00' },
      dinner: { start: '19:00', end: '22:00' },
      isOpen: ![0].includes(dayOfWeek),
    }));
    await Schedule.insertMany(days);
    logger.info('✅ Horaires semaine insérés.');
  }

  logger.info('🎉 Seed terminé. Pensez à sécuriser les identifiants générés.');
  process.exit(0);
}

seed().catch((error) => {
  logger.error({ err: error }, 'Seed échoué');
  process.exit(1);
});
