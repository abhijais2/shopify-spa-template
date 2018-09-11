const compose = require('koa-compose')
const fs = require('fs')
const { extname, resolve, join } = require('path')
const moment = require('moment')
const serveStatic = require('koa-static')

const staticPath = resolve(__dirname, '../../dist')
const oneYearInSecs = moment.duration(1, 'years').asSeconds()

module.exports = () => {
  if (process.env.NODE_ENV !== 'development') {
    return compose([
      serveStatic(staticPath, {
        setHeaders (res, path, stats) {
          const isHtml = /html/.test(extname(path))
          if (!isHtml) {
            res.setHeader('Cache-Control', `max-age=${oneYearInSecs}`)
          }
        }
      }),
      indexFallbackMiddleware()
    ])
  } else {
    return () => {}
  }
}

function indexFallbackMiddleware () {
  const indexFile = fs.readFileSync(join(staticPath, 'index.html'), 'utf8')
  return async (ctx, next) => {
    ctx.body = indexFile
    await next()
  }
}
