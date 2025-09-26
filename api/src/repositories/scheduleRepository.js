// src/repositories/scheduleRepository.js
// Requêtes SQL pour la table des horaires hebdomadaires.
const db = require('../db');

function mapSchedule(row) {
  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    lunch: { start: row.lunch_start, end: row.lunch_end },
    dinner: { start: row.dinner_start, end: row.dinner_end },
    isOpen: row.is_open,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getAll() {
  const { rows } = await db.query('SELECT * FROM schedules ORDER BY day_of_week ASC');
  return rows.map(mapSchedule);
}

async function findByDay(dayOfWeek) {
  const { rows } = await db.query('SELECT * FROM schedules WHERE day_of_week = $1', [dayOfWeek]);
  return rows[0] ? mapSchedule(rows[0]) : null;
}

async function upsert(dayOfWeek, payload) {
  const { lunch, dinner, isOpen } = payload;
  const { rows } = await db.query(
    `INSERT INTO schedules (
      day_of_week, lunch_start, lunch_end, dinner_start, dinner_end, is_open, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    ON CONFLICT (day_of_week) DO UPDATE SET
      lunch_start = EXCLUDED.lunch_start,
      lunch_end = EXCLUDED.lunch_end,
      dinner_start = EXCLUDED.dinner_start,
      dinner_end = EXCLUDED.dinner_end,
      is_open = EXCLUDED.is_open,
      updated_at = NOW()
    RETURNING *`,
    [dayOfWeek, lunch.start, lunch.end, dinner.start, dinner.end, isOpen],
  );
  return mapSchedule(rows[0]);
}

module.exports = {
  getAll,
  findByDay,
  upsert,
};
