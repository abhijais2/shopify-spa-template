const Koa = require('koa')
const koaBetterBody = require('koa-better-body')
const middleware = require('./middleware')

const app = new Koa()

app
  .use(koaBetterBody({ jsonLimit: '1mb' }))
  .use(middleware(app))

module.exports = app
