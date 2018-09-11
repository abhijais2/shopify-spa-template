const mongoose = require('mongoose')
const { MONGODB_URI } = require('nconf').get('mongodb')
const logger = require('server/services/logger')

// TODO: abstract out error with extending error class
module.exports = () => {
  mongoose.connect(MONGODB_URI, { auto_reconnect: true })

  mongoose.connection.on('connecting', function () {
    logger.debug({ message: `mongoose connecting to mlbal @ ${MONGODB_URI}` })
  })

  mongoose.connection.on('connected', function () {
    logger.debug({ message: `Mongoose default connection open to ${MONGODB_URI}` })
  })

  mongoose.connection.on('error', function (error) {
    logger.debug({ message: `Mongoose default connection error`, error })
  })

  mongoose.connection.on('disconnected', function () {
    logger.debug({ message: `Mongoose default connection disconnected` })
  })

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      logger.error('Mongoose default connection disconnected through app termination')
      process.exit(0)
    })
  })
}
