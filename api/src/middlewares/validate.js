// src/middlewares/validate.js
// Applique une validation Zod sur le corps, les query params ou les params.
const { ValidationError } = require('../utils/errors');

/**
 * Crée un middleware de validation Zod.
 * @param {{ body?: import('zod').ZodSchema, query?: import('zod').ZodSchema, params?: import('zod').ZodSchema }} schemaObj
 * @returns {import('express').RequestHandler}
 */
function validate(schemaObj) {
  return (req, res, next) => {
    try {
      if (schemaObj.body) {
        req.body = schemaObj.body.parse(req.body);
      }
      if (schemaObj.query) {
        req.query = schemaObj.query.parse(req.query);
      }
      if (schemaObj.params) {
        req.params = schemaObj.params.parse(req.params);
      }
      next();
    } catch (error) {
      const details = error.errors ? error.errors.map((err) => err.message) : undefined;
      const validationError = new ValidationError('Les données fournies ne sont pas valides.');
      validationError.details = details;
      next(validationError);
    }
  };
}

module.exports = validate;
