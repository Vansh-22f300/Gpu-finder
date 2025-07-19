const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  budget: Number,
  country: String,
  region: String,
  os_type: String,
  ram: Number,
  vcpus: Number,
  is_gpu: { type: Boolean, default: false },
  is_spot: { type: Boolean, default: false },
  pricingResponse: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('FormData', formDataSchema);
