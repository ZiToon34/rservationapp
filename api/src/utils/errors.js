// src/utils/errors.js
// Définit des classes d'erreurs personnalisées pour clarifier les retours d'API.
class ApplicationError extends Error {
  /**
   * @param {string} message Message utilisateur (français).
   * @param {number} statusCode Code HTTP.
   * @param {string} [code] Code interne optionnel.
   */
  constructor(message, statusCode, code = 'APP_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

class ValidationError extends ApplicationError {
  constructor(message = 'Données invalides') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class AuthError extends ApplicationError {
  constructor(message = 'Authentification requise') {
    super(message, 401, 'AUTH_ERROR');
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message = 'Accès refusé') {
    super(message, 403, 'FORBIDDEN');
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = 'Ressource introuvable') {
    super(message, 404, 'NOT_FOUND');
  }
}

module.exports = {
  ApplicationError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
};
