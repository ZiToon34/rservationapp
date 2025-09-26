// src/repositories/adminRepository.js
// Opérations SQL pour la table des administrateurs.
const db = require('../db');

function mapAdmin(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findByEmail(email) {
  const { rows } = await db.query('SELECT * FROM admins WHERE email = $1 LIMIT 1', [email]);
  return mapAdmin(rows[0]);
}

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM admins WHERE id = $1 LIMIT 1', [id]);
  return mapAdmin(rows[0]);
}

async function create({ email, passwordHash }) {
  const { rows } = await db.query(
    `INSERT INTO admins (email, password_hash)
     VALUES ($1, $2)
     RETURNING *`,
    [email, passwordHash],
  );
  return mapAdmin(rows[0]);
}

module.exports = {
  findByEmail,
  findById,
  create,
};
