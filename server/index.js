require('dotenv').config()

const path = require('path')
const appModulePath = require('app-module-path')
const nconf = require('nconf').argv().env()

nconf.defaults(require('../config'))
appModulePath.addPath(path.resolve(__dirname, '..'))

require('./init').register()

const app = require('./app')
const logger = require('./services/logger')

const server = app.listen(process.env.APP_PORT || 3001, () => {})

logger.debug({
  NODE_ENV: process.env.NODE_ENV,
  ADDRESS: server.address()
})

app.on('error', err => {
  logger.error(err)
})
