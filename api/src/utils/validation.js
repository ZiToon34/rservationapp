// src/utils/validation.js
// Regroupe des validations simples réutilisables.
const PHONE_REGEX = /^(\+33|0)[1-9](\d{2}){4}$/;
const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Vérifie un numéro de téléphone français basique.
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  return PHONE_REGEX.test(phone);
}

/**
 * Vérifie un format horaire HH:MM.
 * @param {string} time
 * @returns {boolean}
 */
function isValidTime(time) {
  return TIME_REGEX.test(time);
}

module.exports = {
  isValidPhone,
  isValidTime,
};
