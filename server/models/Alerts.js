const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlertsSchema = new Schema({
  store_identifier: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  status: { type: String, enum: ['active', 'deleted'], default: 'active' }
})

module.exports = mongoose.model('Alerts', AlertsSchema)
