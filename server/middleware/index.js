const compose = require('koa-compose')
// const helmet = require('koa-helmet')
const cors = require('@koa/cors')
const respond = require('koa-respond')
const ejsRender = require('koa-ejs')
const path = require('path')

const router = require('../router')

const requestLogger = require('./request-logger')
const errorHandler = require('./error-handler')
const serveStatic = require('./serve-static')
const session = require('./session')

module.exports = (app) => {
  ejsRender(app, {
    root: path.join(__dirname, '..', '..'),
    layout: false,
    cache: false,
    viewExt: 'html',
    debug: false // isDebug
  })

  return compose([
    // helmet(),
    cors(),
    requestLogger(),
    respond(),
    errorHandler(),
    session(app),
    serveStatic(),
    router.routes(),
    router.allowedMethods()
  ])
}
