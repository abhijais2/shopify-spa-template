const axios = require('axios')

const client = axios.create({
  timeout: 5000,
  headers: {
    json: true
  }
})

module.exports = client

/* function buildBaseUrl () {
  const protocol = config.SECURE ? 'https://' : 'http://'
  const port = config.PORT ? `:${config.PORT}` : ''
  const endpoint = config.BASE_ENDPOINT ? `/${config.BASE_ENDPOINT}` : ''
  const version = `/v${config.VERSION}`

  return [protocol, config.HOST, port, endpoint, version].join('')
} */
