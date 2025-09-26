// src/models/SpecialDay.js
// Jours spéciaux forçant l'ouverture ou la fermeture.
const mongoose = require('mongoose');

const specialDaySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

specialDaySchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('SpecialDay', specialDaySchema);
