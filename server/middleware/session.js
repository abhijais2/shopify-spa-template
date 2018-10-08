const session = require('koa-session')

module.exports = (app) => {
  app.keys = ['RANDOM_SECRET_KEY']
  return session({}, app)
}
