const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lowStockSchema = new Schema({
  stock_alert_level: { type: Number },
  filters: {
    type: { type: String, enum: ['basic', 'advanced'] },
    basic: {
      published_product_only: { type: Boolean },
      shopify_tracks_inventory: { type: Boolean },
      product_belongs_collections: { type: Array },
      product_not_belongs_collections: { type: Array },
      product_venodrs: { type: Array }
    }
  }
})

const hideUnhideSchema = new Schema({
  actions: {
    auto_hide_sold_out: { type: Boolean },
    auto_unhide_in_stock: { type: Boolean }
  },
  filters: {
    type: { type: String, enum: ['basic', 'advanced'] },
    basic: {
      no_image_hidden_products_publish_unallowed: { type: Boolean },
      sold_out_purchase_allowed_hide_unallowed: { type: Boolean },
      sold_out_purchase_allowed_publish_allowed: { type: Boolean }
    }
  }
})

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
  },
  low_stock: lowStockSchema,
  hide_unhide: hideUnhideSchema
})

module.exports = mongoose.model('Alerts', AlertsSchema)
