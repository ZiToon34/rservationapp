// src/app.js
// Configure l'application Express : middlewares, routes, sécurisation.
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// Sécurité HTTP de base
app.use(helmet());

// CORS : autorise le front déployé (ou tous les domaines en dev si non configuré)
app.use(
  cors({
    origin: env.clientUrl === '*' ? true : env.clientUrl,
    credentials: true,
  }),
);

// Parsing JSON
app.use(express.json());

// Routes principales
app.use('/api', routes);

// Page de garde simple
app.get('/', (_req, res) => {
  res.send('API de réservation de restaurant en cours de fonctionnement.');
});

// 404 & erreurs
app.use(notFound);
app.use(errorHandler);

module.exports = app;
