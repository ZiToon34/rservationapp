// src/middlewares/notFound.js
// Retourne une erreur 404 pour les routes inconnues.
function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route introuvable',
  });
}

module.exports = notFound;
