const ServiceError = require('../service-error')

class DataServiceError extends ServiceError {
  constructor (arg, httpCode) {
    super(arg)
    this.httpCode = httpCode || 503
  }
}

module.exports = DataServiceError
