const Router = require('koa-router')

// const shopifyAdaptorRouter = require('./adaptor')
const apiRouter = require('./api')

const router = new Router()

router
  // .use('/adaptor', shopifyAdaptorRouter.routes())
  .use('/api', apiRouter.routes())

module.exports = router
