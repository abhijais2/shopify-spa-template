const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoresSchema = new Schema({
  store_identifier: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  status: { type: String, enum: ['active', 'deleted'], default: 'active' },
  secret_info: {
    access_token: { type: String }
  },
  store_info: Schema.Types.Mixed
})

module.exports = mongoose.model('Stores', StoresSchema)
