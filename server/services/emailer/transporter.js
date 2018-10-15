const nodemailer = require('nodemailer')
const nconf = require('nconf')
const config = nconf.get('emailer')
const transport = require(`./transports/${config.TRANSPORT}`)

const defaultMailOptions = {
  from: config.FROM
}

const transporter = nodemailer.createTransport(transport, defaultMailOptions)

module.exports = transporter
