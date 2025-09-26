// src/repositories/settingsRepository.js
// Gestion des paramètres globaux stockés dans PostgreSQL.
const db = require('../db');

function mapSettings(row) {
  if (!row) return null;
  return {
    id: row.id,
    capacityMode: row.capacity_mode,
    totalCapacity: row.total_capacity || 0,
    tables: row.tables_json || [],
    maxPeoplePerReservation: row.max_people_per_reservation,
    reservationDelayMin: row.reservation_delay_min,
    reservationDelayMax: row.reservation_delay_max,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getSettings() {
  const { rows } = await db.query('SELECT * FROM settings WHERE id = 1');
  return mapSettings(rows[0]);
}

async function upsertSettings(payload) {
  const {
    capacityMode,
    totalCapacity,
    tables,
    maxPeoplePerReservation,
    reservationDelayMin,
    reservationDelayMax,
  } = payload;

  const { rows } = await db.query(
    `INSERT INTO settings (
      id,
      capacity_mode,
      total_capacity,
      tables_json,
      max_people_per_reservation,
      reservation_delay_min,
      reservation_delay_max,
      created_at,
      updated_at
    ) VALUES (
      1, $1, $2, $3::jsonb, $4, $5, $6, NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      capacity_mode = EXCLUDED.capacity_mode,
      total_capacity = EXCLUDED.total_capacity,
      tables_json = EXCLUDED.tables_json,
      max_people_per_reservation = EXCLUDED.max_people_per_reservation,
      reservation_delay_min = EXCLUDED.reservation_delay_min,
      reservation_delay_max = EXCLUDED.reservation_delay_max,
      updated_at = NOW()
    RETURNING *`,
    [
      capacityMode,
      totalCapacity || null,
      JSON.stringify(tables || []),
      maxPeoplePerReservation,
      reservationDelayMin,
      reservationDelayMax,
    ],
  );

  return mapSettings(rows[0]);
}

module.exports = {
  getSettings,
  upsertSettings,
};

