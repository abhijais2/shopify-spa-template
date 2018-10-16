module.exports = {
  PORT: process.env.PORT || 3001,
  APP_HOST: process.env.APP_HOST,
  REDIRECT_URI: `${process.env.APP_HOST}/adaptor/auth/callback`,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  SCOPE: `read_products,write_products,read_product_listings,read_customers,write_customers,read_orders,write_orders,read_draft_orders,write_draft_orders,read_inventory,write_inventory,read_locations,read_script_tags,write_script_tags`,
  APP_NAME: `process.env.APP_NAME`,
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug'
}
