// src/routes/adminRoutes.js
// Routes protégées pour la gestion des réservations et paramètres.
const express = require('express');
const adminAuth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  adminReservationBody,
  settingsBody,
  dateQuery,
  scheduleBody,
  specialDayBody,
  specialDaysQuery,
  dayParams,
} = require('./schemas');
const {
  listAdminReservations,
  createAdminReservation,
  deleteReservation,
} = require('../controllers/reservationController');
const {
  getSettings,
  updateSettings,
  getSchedules,
  updateSchedule,
  getSpecialDays,
  upsertSpecialDay,
  deleteSpecialDay,
  manualPurge,
} = require('../controllers/settingsController');

const router = express.Router();

router.use(adminAuth);

// GET /admin/reservations
router.get('/reservations', validate({ query: dateQuery }), listAdminReservations);

// POST /admin/reservations
router.post('/reservations', validate({ body: adminReservationBody }), createAdminReservation);

// DELETE /admin/reservations/:id
router.delete('/reservations/:id', deleteReservation);

// GET /admin/settings
router.get('/settings', getSettings);

// PUT /admin/settings
router.put('/settings', validate({ body: settingsBody }), updateSettings);

// GET /admin/schedules
router.get('/schedules', getSchedules);

// PUT /admin/schedules/:dayOfWeek
router.put('/schedules/:dayOfWeek', validate({ params: dayParams, body: scheduleBody }), updateSchedule);

// GET /admin/special-days
router.get('/special-days', validate({ query: specialDaysQuery.partial() }), getSpecialDays);

// POST /admin/special-days
router.post('/special-days', validate({ body: specialDayBody }), upsertSpecialDay);

// DELETE /admin/special-days/:id
router.delete('/special-days/:id', deleteSpecialDay);

// POST /admin/maintenance/purge
router.post('/maintenance/purge', manualPurge);

module.exports = router;
