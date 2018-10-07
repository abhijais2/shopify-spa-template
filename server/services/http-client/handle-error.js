const HttpClientError = require('./http-client-error')

module.exports = (err) => {
  if (err.response) {
    throw new HttpClientError(err.response.data.statusMessage, err.response.status)
  } else {
    throw new HttpClientError(err.message)
  }
}
