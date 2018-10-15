const transport = require('nodemailer-mailgun-transport')
const { MG_API_KEY, MG_DOMAIN } = require('nconf').get('mailgun')

const options = {
  auth: {
    api_key: MG_API_KEY,
    domain: MG_DOMAIN
  }
}

module.exports = transport(options)
