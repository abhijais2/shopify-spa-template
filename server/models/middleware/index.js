const mongoose = require('mongoose')

const { lastUpdate, mongooseLogger } = require('./plugins')

mongoose.plugin(lastUpdate)
mongoose.plugin(mongooseLogger)

module.exports = {}
