// src/repositories/specialDayRepository.js
// Accès aux jours spéciaux (ouvertures/fermetures exceptionnelles).
const db = require('../db');

function mapSpecialDay(row) {
  if (!row) return null;
  return {
    id: row.id,
    date: row.date,
    isOpen: row.is_open,
    createdAt: row.created_at,
  };
}

async function findByDate(dateIso) {
  const { rows } = await db.query('SELECT * FROM special_days WHERE date = $1', [dateIso]);
  return mapSpecialDay(rows[0]);
}

async function findRange(from, to) {
  const conditions = [];
  const params = [];
  if (from) {
    params.push(from);
    conditions.push(`date >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    conditions.push(`date <= $${params.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await db.query(`SELECT * FROM special_days ${where} ORDER BY date ASC`, params);
  return rows.map(mapSpecialDay);
}

async function upsert(dateIso, isOpen) {
  const { rows } = await db.query(
    `INSERT INTO special_days (date, is_open, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (date) DO UPDATE SET is_open = EXCLUDED.is_open
     RETURNING *`,
    [dateIso, isOpen],
  );
  return mapSpecialDay(rows[0]);
}

async function deleteById(id) {
  await db.query('DELETE FROM special_days WHERE id = $1', [id]);
}

async function deleteBefore(dateIso) {
  await db.query('DELETE FROM special_days WHERE date < $1', [dateIso]);
}

module.exports = {
  findByDate,
  findRange,
  upsert,
  deleteById,
  deleteBefore,
};
