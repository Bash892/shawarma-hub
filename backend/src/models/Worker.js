const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true }, // e.g. Cook, Driver
    phone: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
