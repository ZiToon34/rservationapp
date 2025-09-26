// src/models/Schedule.js
// Horaires d'ouverture par jour de la semaine.
const mongoose = require('mongoose');

const windowSchema = new mongoose.Schema(
  {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const scheduleSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
      unique: true,
    },
    lunch: {
      type: windowSchema,
      required: true,
      default: { start: '12:00', end: '14:30' },
    },
    dinner: {
      type: windowSchema,
      required: true,
      default: { start: '19:00', end: '22:30' },
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

scheduleSchema.index({ dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
