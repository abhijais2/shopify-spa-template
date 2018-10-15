const transport = require('nodemailer-sendgrid-transport')
const nconf = require('nconf')

const config = nconf.get('sendgrid')
const options = {
  auth: {
    api_key: config.API_KEY
  }
}

module.exports = transport(options)
