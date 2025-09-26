// src/models/Setting.js
// Paramètres généraux de capacité et de règles de réservation.
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const settingSchema = new mongoose.Schema(
  {
    capacityMode: {
      type: String,
      enum: ['total', 'tables'],
      required: true,
      default: 'total',
    },
    totalCapacity: {
      type: Number,
      default: 50,
      min: 1,
    },
    tables: {
      type: [tableSchema],
      default: [],
    },
    maxPeoplePerReservation: {
      type: Number,
      default: 6,
      min: 1,
    },
    reservationDelayMin: {
      type: Number,
      default: 2,
      min: 0,
    },
    reservationDelayMax: {
      type: Number,
      default: 720,
      min: 1,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Setting', settingSchema);
