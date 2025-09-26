// src/scripts/seed.js
// Script d'initialisation : crée un admin, des paramètres et des horaires par défaut.
const bcrypt = require('bcryptjs');
const { connectDatabase } = require('../config/database');
const db = require('../db');
const settingsRepository = require('../repositories/settingsRepository');
const scheduleRepository = require('../repositories/scheduleRepository');
const adminRepository = require('../repositories/adminRepository');
const logger = require('../config/logger');

const SALT_ROUNDS = 10;

async function ensureSchema() {
  await db.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      capacity_mode TEXT NOT NULL,
      total_capacity INTEGER,
      tables_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      max_people_per_reservation INTEGER NOT NULL,
      reservation_delay_min INTEGER NOT NULL,
      reservation_delay_max INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS schedules (
      id SERIAL PRIMARY KEY,
      day_of_week INTEGER NOT NULL UNIQUE,
      lunch_start TEXT NOT NULL,
      lunch_end TEXT NOT NULL,
      dinner_start TEXT NOT NULL,
      dinner_end TEXT NOT NULL,
      is_open BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS special_days (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      date DATE NOT NULL UNIQUE,
      is_open BOOLEAN NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      date DATE NOT NULL,
      time TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      people_count INTEGER NOT NULL,
      comment TEXT,
      source TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.query('CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(date, time)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_special_days_date ON special_days(date)');
}

async function seedAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'durand.olivier.34@icloud.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || '11062015Ro.';

  const existingAdmin = await adminRepository.findByEmail(adminEmail);
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    await adminRepository.create({ email: adminEmail, passwordHash });
    logger.info(`✅ Admin créé : ${adminEmail} / ${adminPassword}`);
  } else {
    logger.info('ℹ️  Admin déjà présent, aucune action.');
  }
}

async function seedSettings() {
  const settings = await settingsRepository.getSettings();
  if (!settings) {
    await settingsRepository.upsertSettings({
      capacityMode: 'total',
      totalCapacity: 40,
      tables: [
        { tableNumber: 1, seats: 2 },
        { tableNumber: 2, seats: 2 },
        { tableNumber: 3, seats: 4 },
        { tableNumber: 4, seats: 4 },
        { tableNumber: 5, seats: 6 },
      ],
      maxPeoplePerReservation: 6,
      reservationDelayMin: 2,
      reservationDelayMax: 720,
    });
    logger.info('✅ Paramètres par défaut créés.');
  }
}

async function seedSchedules() {
  const schedules = await scheduleRepository.getAll();
  if (schedules.length === 0) {
    const days = Array.from({ length: 7 }, (_, dayOfWeek) => ({
      lunch: { start: '12:00', end: '14:00' },
      dinner: { start: '19:00', end: '22:00' },
      isOpen: dayOfWeek !== 0,
    }));

    await Promise.all(
      days.map((schedule, index) => scheduleRepository.upsert(index, schedule)),
    );
    logger.info('✅ Horaires semaine insérés.');
  }
}

async function seed() {
  await connectDatabase();
  await ensureSchema();
  await seedAdmin();
  await seedSettings();
  await seedSchedules();

  logger.info('🎉 Seed terminé. Pensez à sécuriser les identifiants générés.');
  process.exit(0);
}

seed().catch((error) => {
  logger.error({ err: error }, 'Seed échoué');
  process.exit(1);
});
