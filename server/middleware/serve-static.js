const compose = require('koa-compose')
// const fs = require('fs')
const { resolve } = require('path')
// const moment = require('moment')
const serveStatic = require('koa-static')

const staticPath = resolve(__dirname, '..', '..')
// const oneYearInSecs = moment.duration(1, 'years').asSeconds()

module.exports = () => {
  if (process.env.NODE_ENV === 'development') {
    // return compose([indexFallbackMiddleware()])
    // return async (ctx, next) => {
    //   await next()
    // }
    return async () => {}
  } else {
    return compose([serveStatic(staticPath, { defer: true })])
  }
}

// function indexFallbackMiddleware () {
//   const indexFile = fs.readFileSync(join(staticPath, 'index.html'), 'utf8')
//   return async (ctx, next) => {
//     ctx.body = indexFile
//     await next()
//   }
// }
