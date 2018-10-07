const logger = require('server/services/logger')

module.exports = exports = function lastUpdatedPlugin (schema, options) {
  schema.pre('save', function (next) {
    logger.debug('lastUpdate-plugin | pre-save hook')
    this.updated_at = (new Date()).toString()
    next()
  })

  schema.pre('findOneAndUpdate', function (next, params) {
    logger.debug({ message: 'lastUpdate-plugin | pre-findOneAndUpdate hook' })
    this._update.updated_at = (new Date()).toString()
    next()
  })

  if (options && options.index) {
    schema.path('updated_at').index(options.index)
  }
}
