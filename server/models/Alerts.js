const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlertsSchema = new Schema({
  store_identifier: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  status: { type: String, enum: ['active', 'deleted'], default: 'active' },
  type: { type: String, enum: ['low_stock', 'hide_unhide'], required: true },
  name: { type: String, required: true },
  frequency: {
    type: { type: String, enum: ['instant', 'scheduled'], required: true },
    scheduled: {
      cron_interval: { type: String } // TODO: add custom validation for cron interval string
    }
  },
  notification: {
    type: { type: String, enum: ['email'], default: 'email' },
    email: {
      recipients: { type: Array },
      editor_type: { type: String, enum: ['wysiwyg', 'html'], default: 'wysiwyg' },
      subject: { type: String },
      message: { type: String }
    }
  }
})

module.exports = mongoose.model('Alerts', AlertsSchema)
