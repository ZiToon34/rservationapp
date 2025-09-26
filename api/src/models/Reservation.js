// src/models/Reservation.js
// Modèle Mongoose pour les réservations clients ou admin.
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    peopleCount: {
      type: Number,
      required: true,
      min: 1,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      enum: ['client', 'admin'],
      required: true,
      default: 'client',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  },
);

reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
