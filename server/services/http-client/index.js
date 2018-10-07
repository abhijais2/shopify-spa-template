const client = require('./client')
const logger = require('../logger')

module.exports = {
  async request (config) {
    logger.debug({ message: 'Making http request.', config })
    const response = await client.request(config)
    logger.debug({ message: 'Response from http request', data: response.data })
    return response.data
  },

  async get (config) {
    return this.request(Object.assign({}, config, { method: 'get' }))
  },

  async post (config) {
    return this.request(Object.assign({}, config, { method: 'post' }))
  },

  async put (config) {
    return this.request(Object.assign({}, config, { method: 'put' }))
  },

  async delete (config) {
    return this.request(Object.assign({}, config, { method: 'delete' }))
  }
}
