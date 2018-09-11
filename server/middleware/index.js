const compose = require('koa-compose')
const helmet = require('koa-helmet')
const cors = require('@koa/cors')
const respond = require('koa-respond')

const router = require('../router')

const requestLogger = require('./request-logger')
const errorHandler = require('./error-handler')
const serveStatic = require('./serve-static')

module.exports = (app) => {
  return compose([
    helmet(),
    cors(),
    requestLogger(),
    respond(),
    errorHandler(),
    serveStatic(),
    router.routes(),
    router.allowedMethods()
  ])
}
