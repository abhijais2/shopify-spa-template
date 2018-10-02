const mongoose = require('mongoose')

const { lastUpdate, mongooseLogger } = require('./plugins')
const {} = require('./validators')

mongoose.plugin(lastUpdate)
mongoose.plugin(mongooseLogger)

module.exports = {}
