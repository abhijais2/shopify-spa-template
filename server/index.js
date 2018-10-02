require('dotenv').config()

const path = require('path')
const appModulePath = require('app-module-path')
const nconf = require('nconf').argv().env()

nconf.defaults(require('../config'))
appModulePath.addPath(path.resolve(__dirname, '..'))

require('./init').register()

const app = require('./app')
const logger = require('./services/logger')
const { PORT } = nconf.get('app')

const server = app.listen(PORT || 3001, () => {})

logger.debug({
  NODE_ENV: process.env.NODE_ENV,
  ADDRESS: server.address()
})

app.on('error', err => {
  logger.error(err)
})
