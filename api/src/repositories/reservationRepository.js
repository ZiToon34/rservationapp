// src/repositories/reservationRepository.js
// Gère les lectures/écritures liées aux réservations.
const db = require('../db');

function mapReservation(row) {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    name: row.name,
    phone: row.phone,
    email: row.email,
    peopleCount: row.people_count,
    comment: row.comment,
    source: row.source,
    createdAt: row.created_at,
  };
}

async function findByDate(dateIso) {
  const { rows } = await db.query(
    'SELECT * FROM reservations WHERE date = $1 ORDER BY time ASC, created_at ASC',
    [dateIso],
  );
  return rows.map(mapReservation);
}

async function create(reservation) {
  const { rows } = await db.query(
    `INSERT INTO reservations (
      date, time, name, phone, email, people_count, comment, source, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING *`,
    [
      reservation.date,
      reservation.time,
      reservation.name,
      reservation.phone,
      reservation.email,
      reservation.peopleCount,
      reservation.comment || null,
      reservation.source,
    ],
  );
  return mapReservation(rows[0]);
}

async function deleteById(id) {
  const result = await db.query('DELETE FROM reservations WHERE id = $1', [id]);
  return result.rowCount > 0;
}

async function deleteBefore(dateIso) {
  await db.query('DELETE FROM reservations WHERE date < $1', [dateIso]);
}

async function sumPeopleForSlot(dateIso, time) {
  const { rows } = await db.query(
    'SELECT COALESCE(SUM(people_count), 0) AS total FROM reservations WHERE date = $1 AND time = $2',
    [dateIso, time],
  );
  return Number.parseInt(rows[0].total, 10) || 0;
}

module.exports = {
  findByDate,
  create,
  deleteById,
  deleteBefore,
  sumPeopleForSlot,
};
