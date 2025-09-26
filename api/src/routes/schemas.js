// src/routes/schemas.js
// Schémas Zod centralisés pour valider les entrées des routes.
const { z } = require('zod');

const emailSchema = z.string().email('Adresse e-mail invalide.');
const passwordSchema = z.string().min(8, 'Mot de passe trop court (min 8 caractères).');
const dateSchema = z.string().regex(/\d{4}-\d{2}-\d{2}/, 'Date attendue au format YYYY-MM-DD');
const timeSchema = z.string().regex(/^[0-2]?[0-9]:[0-5][0-9]$/, 'Heure invalide');

const intFromString = (schema) =>
  z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? value : parsed;
    }
    return value;
  }, schema);

const registerBody = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const loginBody = registerBody;

const availabilityQuery = z.object({
  date: dateSchema,
  peopleCount: intFromString(z.number().int().min(1)).optional(),
});

const reservationBodyBase = z.object({
  date: dateSchema,
  time: timeSchema,
  peopleCount: intFromString(z.number().int().min(1)),
  name: z.string().min(2),
  email: emailSchema,
  phone: z.string().min(6),
  comment: z.string().max(500).optional(),
});

const publicReservationBody = reservationBodyBase;
const adminReservationBody = reservationBodyBase;

const settingsBody = z.object({
  capacityMode: z.enum(['total', 'tables']),
  totalCapacity: intFromString(z.number().int().min(1)).optional(),
  tables: z
    .array(
      z.object({
        tableNumber: intFromString(z.number().int().min(1)),
        seats: intFromString(z.number().int().min(1)),
      }),
    )
    .optional(),
  maxPeoplePerReservation: intFromString(z.number().int().min(1)),
  reservationDelayMin: intFromString(z.number().int().min(0)),
  reservationDelayMax: intFromString(z.number().int().min(1)),
});

const scheduleBody = z.object({
  lunch: z.object({ start: timeSchema, end: timeSchema }),
  dinner: z.object({ start: timeSchema, end: timeSchema }),
  isOpen: z.boolean(),
});

const specialDayBody = z.object({
  date: dateSchema,
  isOpen: z.boolean(),
});

const dateQuery = z.object({
  date: dateSchema,
});

const specialDaysQuery = z.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
});

const dayParams = z.object({
  dayOfWeek: z.string().regex(/^[0-6]$/),
});

module.exports = {
  registerBody,
  loginBody,
  availabilityQuery,
  publicReservationBody,
  adminReservationBody,
  settingsBody,
  scheduleBody,
  specialDayBody,
  dateQuery,
  specialDaysQuery,
  dayParams,
};
