const Router = require('koa-router')
const logger = require('server/services/logger')

const { CLIENT_ID } = require('nconf').get('app')
const shopifyAdaptorRouter = require('./adaptor')
const apiRouter = require('./api')

const router = new Router()

router
  .use('/adaptor', shopifyAdaptorRouter.routes())
  .use('/api', apiRouter.routes())

router.all('*', async (ctx, next) => {
  if (!/adaptor|api|dist/.test(ctx.path)) {
    const { store_identifier } = ctx.request.query
    logger.info({ message: 'Serving index file', store_identifier })

    await ctx.render('dist/index', {
      store_identifier,
      api_key: CLIENT_ID
    })
  }
  await next()
})

module.exports = router
