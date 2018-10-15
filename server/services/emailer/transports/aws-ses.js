const transport = require('nodemailer-ses-transport')
const nconf = require('nconf')

const config = nconf.get('aws-ses')
const options = {
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY,
  rateLimit: 5
}

module.exports = transport(options)
