// src/services/reservationService.js
// Contient toute la logique métier liée aux disponibilités et réservations.
const Setting = require('../models/Setting');
const Schedule = require('../models/Schedule');
const SpecialDay = require('../models/SpecialDay');
const Reservation = require('../models/Reservation');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { parseIsoDateParis, dayjs, PARIS_TZ } = require('../utils/time');
const { isValidTime } = require('../utils/validation');

const SLOT_DURATION_MIN = 15;

/**
 * Génère les créneaux de 15 minutes pour une plage horaire donnée.
 * @param {{ start: string, end: string }} window
 * @returns {string[]} Tableau d'horaires HH:MM.
 */
function generateSlots(window) {
  const slots = [];
  const start = dayjs.tz(`2000-01-01T${window.start}:00`, PARIS_TZ);
  const end = dayjs.tz(`2000-01-01T${window.end}:00`, PARIS_TZ);
  let cursor = start;

  while (cursor.isBefore(end) || cursor.isSame(end)) {
    slots.push(cursor.format('HH:mm'));
    cursor = cursor.add(SLOT_DURATION_MIN, 'minute');
  }

  return slots;
}

/**
 * Retourne la liste complète des créneaux du jour (midi + soir).
 * @param {import('../models/Schedule')} schedule
 * @returns {string[]}
 */
function buildDailySlots(schedule) {
  const slots = [];
  if (schedule.lunch?.start && schedule.lunch?.end) {
    slots.push(...generateSlots(schedule.lunch));
  }
  if (schedule.dinner?.start && schedule.dinner?.end) {
    slots.push(...generateSlots(schedule.dinner));
  }
  return slots;
}

/**
 * Filtre les créneaux selon les délais min / max.
 * @param {string[]} slots
 * @param {dayjs.Dayjs} dateParis
 * @param {import('../models/Setting')} settings
 * @returns {string[]}
 */
function filterByDelays(slots, dateParis, settings) {
  const now = dayjs().tz(PARIS_TZ);

  return slots.filter((slot) => {
    const [hour, minute] = slot.split(':').map((value) => Number.parseInt(value, 10));
    const slotDate = dateParis.hour(hour).minute(minute);
    const diffHours = slotDate.diff(now, 'minute') / 60;

    if (settings.reservationDelayMin && diffHours < settings.reservationDelayMin) {
      return false;
    }
    if (settings.reservationDelayMax && diffHours > settings.reservationDelayMax) {
      return false;
    }
    return diffHours >= 0;
  });
}

/**
 * Tente d'affecter un groupe à une combinaison de tables.
 * @param {number[]} availableTables Copie mutable des places restantes par table.
 * @param {number} peopleCount Taille du groupe.
 * @returns {boolean} true si l'allocation est possible.
 */
function allocateTables(availableTables, peopleCount) {
  // On tri du plus petit au plus grand pour optimiser la recherche.
  const tables = availableTables
    .map((seats, index) => ({ seats, index }))
    .sort((a, b) => a.seats - b.seats);

  // Première tentative : une seule table suffit.
  for (const table of tables) {
    if (table.seats >= peopleCount) {
      availableTables[table.index] = 0;
      return true;
    }
  }

  // Sinon on cherche une combinaison (approche brute force mais tables limitées).
  const seatsArray = tables.map((t) => t.seats);

  const result = findCombination(seatsArray, peopleCount);
  if (!result) {
    return false;
  }

  // On consomme les tables utilisées.
  for (const seat of result) {
    const match = tables.find((t) => t.seats === seat && availableTables[t.index] !== 0);
    if (match) {
      availableTables[match.index] = 0;
    }
  }

  return true;
}

/**
 * Recherche une combinaison de tailles de tables couvrant un groupe.
 * @param {number[]} seatsTables
 * @param {number} target
 * @returns {number[]|null}
 */
function findCombination(seatsTables, target) {
  const total = seatsTables.length;
  const maxCombinations = 1 << total;
  let best = null;
  let bestOverflow = Number.POSITIVE_INFINITY;

  for (let mask = 1; mask < maxCombinations; mask += 1) {
    let sum = 0;
    const combination = [];
    for (let i = 0; i < total; i += 1) {
      if (mask & (1 << i)) {
        sum += seatsTables[i];
        combination.push(seatsTables[i]);
      }
    }
    if (sum >= target) {
      const overflow = sum - target;
      if (overflow < bestOverflow) {
        bestOverflow = overflow;
        best = combination;
      }
    }
  }

  return best;
}

/**
 * Vérifie si un créneau peut accepter une réservation supplémentaire.
 * @param {string} dateIso Date YYYY-MM-DD.
 * @param {string} time Heure HH:MM.
 * @param {number} peopleCount
 * @param {import('../models/Setting')} settings
 * @param {import('../models/Reservation')[]} reservationsOfDay
 * @returns {boolean}
 */
function slotHasCapacity(dateIso, time, peopleCount, settings, reservationsOfDay) {
  const sameSlotReservations = reservationsOfDay.filter(
    (reservation) => reservation.time === time,
  );

  if (settings.capacityMode === 'total') {
    const occupied = sameSlotReservations.reduce(
      (acc, reservation) => acc + reservation.peopleCount,
      0,
    );
    return occupied + peopleCount <= settings.totalCapacity;
  }

  // Mode tables
  const availableTables = settings.tables.map((table) => table.seats);

  // On réserve les tables pour les réservations existantes
  const reservationsSorted = sameSlotReservations
    .slice()
    .sort((a, b) => b.peopleCount - a.peopleCount);

  for (const reservation of reservationsSorted) {
    if (!allocateTables(availableTables, reservation.peopleCount)) {
      return false;
    }
  }

  // On tente d'ajouter la nouvelle réservation.
  return allocateTables(availableTables, peopleCount);
}

/**
 * Vérifie qu'un horaire appartient bien aux créneaux du jour.
 * @param {string[]} allowedSlots
 * @param {string} time
 */
function ensureTimeInSlots(allowedSlots, time) {
  if (!allowedSlots.includes(time)) {
    throw new ValidationError("L'horaire demandé n'est pas proposé ce jour-là.");
  }
}

/**
 * Retourne les paramètres globaux (ou erreur si absents).
 * @returns {Promise<import('../models/Setting')>}
 */
async function getSettingsOrThrow() {
  const settings = await Setting.findOne();
  if (!settings) {
    throw new NotFoundError('Paramètres indisponibles. Contactez un administrateur.');
  }
  return settings;
}

/**
 * Calcule les créneaux disponibles pour une date donnée.
 * @param {string} dateIso
 * @param {number} peopleCount
 * @returns {Promise<string[]>}
 */
async function getAvailability(dateIso, peopleCount = 1) {
  if (!dateIso) {
    throw new ValidationError('La date est obligatoire.');
  }
  if (!dayjs(dateIso, 'YYYY-MM-DD', true).isValid()) {
    throw new ValidationError('Format de date invalide. Utilisez YYYY-MM-DD.');
  }

  const settings = await getSettingsOrThrow();
  if (peopleCount > settings.maxPeoplePerReservation) {
    throw new ValidationError(
      'Nombre de personnes trop élevé. Merci de contacter le restaurant par téléphone.',
    );
  }

  const dateParis = parseIsoDateParis(dateIso);
  const specialDay = await SpecialDay.findOne({ date: dateParis.toDate() });
  const schedule = await Schedule.findOne({ dayOfWeek: dateParis.day() });

  if (!schedule) {
    return [];
  }

  const isOpen = specialDay ? specialDay.isOpen : schedule.isOpen;
  if (!isOpen) {
    return [];
  }

  const dailySlots = buildDailySlots(schedule);
  if (!dailySlots.length) {
    return [];
  }

  const slotsWithDelay = filterByDelays(dailySlots, dateParis, settings);
  if (!slotsWithDelay.length) {
    return [];
  }

  const reservationsOfDay = await Reservation.find({ date: dateParis.toDate() });

  return slotsWithDelay.filter((slot) =>
    slotHasCapacity(dateIso, slot, peopleCount, settings, reservationsOfDay),
  );
}

/**
 * Crée une réservation après toutes les validations métiers.
 * @param {{ date: string, time: string, peopleCount: number, name: string, email: string, phone: string, comment?: string }} payload
 * @param {'client'|'admin'} source
 * @returns {Promise<import('../models/Reservation')>}
 */
async function createReservation(payload, source) {
  const settings = await getSettingsOrThrow();

  if (payload.peopleCount > settings.maxPeoplePerReservation) {
    throw new ValidationError(
      'Nombre de convives supérieur au maximum autorisé. Merci de nous appeler directement.',
    );
  }

  if (!isValidTime(payload.time)) {
    throw new ValidationError('Format horaire invalide.');
  }

  const dateParis = parseIsoDateParis(payload.date);
  const schedule = await Schedule.findOne({ dayOfWeek: dateParis.day() });
  const specialDay = await SpecialDay.findOne({ date: dateParis.toDate() });

  if (!schedule) {
    throw new ValidationError("Aucun horaire défini pour ce jour.");
  }
  if (specialDay && !specialDay.isOpen) {
    throw new ValidationError('Le restaurant est fermé ce jour-là.');
  }
  if (!specialDay && !schedule.isOpen) {
    throw new ValidationError('Le restaurant est fermé ce jour-là.');
  }

  const slots = buildDailySlots(schedule);
  ensureTimeInSlots(slots, payload.time);

  const validSlots = filterByDelays(slots, dateParis, settings);
  ensureTimeInSlots(validSlots, payload.time);

  const reservationsOfDay = await Reservation.find({ date: dateParis.toDate() });

  const hasCapacity = slotHasCapacity(
    payload.date,
    payload.time,
    payload.peopleCount,
    settings,
    reservationsOfDay,
  );
  if (!hasCapacity) {
    throw new ValidationError('Capacité atteinte sur ce créneau. Merci de choisir un autre horaire.');
  }

  const reservation = await Reservation.create({
    date: dateParis.toDate(),
    time: payload.time,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    peopleCount: payload.peopleCount,
    comment: payload.comment || '',
    source,
  });

  return reservation;
}

module.exports = {
  getAvailability,
  createReservation,
  getSettingsOrThrow,
};
