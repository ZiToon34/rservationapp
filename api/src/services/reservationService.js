// src/services/reservationService.js
// Contient toute la logique métier liée aux disponibilités et réservations.
const settingsRepository = require('../repositories/settingsRepository');
const scheduleRepository = require('../repositories/scheduleRepository');
const specialDayRepository = require('../repositories/specialDayRepository');
const reservationRepository = require('../repositories/reservationRepository');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { parseIsoDateParis, dayjs, PARIS_TZ } = require('../utils/time');
const { isValidTime } = require('../utils/validation');

const SLOT_DURATION_MIN = 15;

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

function allocateTables(availableTables, peopleCount) {
  const tables = availableTables
    .map((seats, index) => ({ seats, index }))
    .sort((a, b) => a.seats - b.seats);

  for (const table of tables) {
    if (table.seats >= peopleCount) {
      availableTables[table.index] = 0;
      return true;
    }
  }

  const seatsArray = tables.map((t) => t.seats);
  const result = findCombination(seatsArray, peopleCount);
  if (!result) {
    return false;
  }

  for (const seat of result) {
    const match = tables.find((t) => t.seats === seat && availableTables[t.index] !== 0);
    if (match) {
      availableTables[match.index] = 0;
    }
  }

  return true;
}

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

function slotHasCapacity(dateIso, time, peopleCount, settings, reservationsOfDay) {
  const sameSlotReservations = reservationsOfDay.filter((reservation) => reservation.time === time);

  if (settings.capacityMode === 'total') {
    const occupied = sameSlotReservations.reduce(
      (acc, reservation) => acc + reservation.peopleCount,
      0,
    );
    return occupied + peopleCount <= settings.totalCapacity;
  }

  const availableTables = settings.tables.map((table) => table.seats);

  const reservationsSorted = sameSlotReservations
    .slice()
    .sort((a, b) => b.peopleCount - a.peopleCount);

  for (const reservation of reservationsSorted) {
    if (!allocateTables(availableTables, reservation.peopleCount)) {
      return false;
    }
  }

  return allocateTables(availableTables, peopleCount);
}

function ensureTimeInSlots(allowedSlots, time) {
  if (!allowedSlots.includes(time)) {
    throw new ValidationError("L'horaire demandé n'est pas proposé ce jour-là.");
  }
}

async function getSettingsOrThrow() {
  const settings = await settingsRepository.getSettings();
  if (!settings) {
    throw new NotFoundError('Paramètres indisponibles. Contactez un administrateur.');
  }
  return settings;
}

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
  const schedule = await scheduleRepository.findByDay(dateParis.day());
  if (!schedule) {
    return [];
  }

  const specialDay = await specialDayRepository.findByDate(dateIso);
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

  const reservationsOfDay = await reservationRepository.findByDate(dateIso);

  return slotsWithDelay.filter((slot) =>
    slotHasCapacity(dateIso, slot, peopleCount, settings, reservationsOfDay),
  );
}

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
  const dateIso = dateParis.format('YYYY-MM-DD');

  const schedule = await scheduleRepository.findByDay(dateParis.day());
  const specialDay = await specialDayRepository.findByDate(dateIso);

  if (!schedule) {
    throw new ValidationError('Aucun horaire défini pour ce jour.');
  }
  if ((specialDay && !specialDay.isOpen) || (!specialDay && !schedule.isOpen)) {
    throw new ValidationError('Le restaurant est fermé ce jour-là.');
  }

  const slots = buildDailySlots(schedule);
  ensureTimeInSlots(slots, payload.time);

  const validSlots = filterByDelays(slots, dateParis, settings);
  ensureTimeInSlots(validSlots, payload.time);

  const reservationsOfDay = await reservationRepository.findByDate(dateIso);
  const hasCapacity = slotHasCapacity(
    dateIso,
    payload.time,
    payload.peopleCount,
    settings,
    reservationsOfDay,
  );
  if (!hasCapacity) {
    throw new ValidationError('Capacité atteinte sur ce créneau. Merci de choisir un autre horaire.');
  }

  const reservation = await reservationRepository.create({
    date: dateIso,
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
