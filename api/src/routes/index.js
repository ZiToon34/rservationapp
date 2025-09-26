// src/routes/index.js
// Assemble toutes les routes de l'application.
const express = require('express');
const authRoutes = require('./authRoutes');
const publicRoutes = require('./publicRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API opérationnelle.' });
});

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
