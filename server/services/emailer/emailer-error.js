const ServiceError = require('../service-error')

class EmailerError extends ServiceError {
  constructor (arg, httpCode) {
    super(arg)
  }
}

module.exports = EmailerError
