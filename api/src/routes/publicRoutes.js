// src/routes/publicRoutes.js
// Routes accessibles aux clients finaux (réservations publiques).
const express = require('express');
const { publicAvailability, publicCreate } = require('../controllers/reservationController');
const { getPublicSettings, getPublicCalendar } = require('../controllers/publicController');
const validate = require('../middlewares/validate');
const { availabilityQuery, publicReservationBody, specialDaysQuery } = require('./schemas');
const { reservationLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// GET /public/settings
router.get('/settings', getPublicSettings);

// GET /public/calendar
router.get('/calendar', validate({ query: specialDaysQuery.partial() }), getPublicCalendar);

// GET /public/availability
router.get('/availability', validate({ query: availabilityQuery }), publicAvailability);

// POST /public/reservations
router.post(
  '/reservations',
  reservationLimiter,
  validate({ body: publicReservationBody }),
  publicCreate,
);

module.exports = router;
