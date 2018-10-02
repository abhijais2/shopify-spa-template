const logger = rootRequire('server/services/logger')

module.exports = exports = function mongooseLogger (schema, options) {
  schema.pre('save', function (next) {
    logger.debug({
      message: 'mongooseLogger-plugin | pre-save hook',
      data: JSON.stringify(this)
    })
    next()
  })

  schema.pre('findOneAndUpdate', function (next, params) {
    logger.debug({
      message: 'mongooseLogger-plugin | pre-findOneAndUpdate hook', 
      data: this._update
    })
    next()
  })
}
