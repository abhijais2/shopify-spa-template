const Router = require('koa-router')
const router = new Router()
const ctrl = require('./controller')
const logger = require('server/services/logger')

router.all('*', async (ctx, next) => {
  logger.debug('Inside adaptor route')
  await next()
})

router.get('/', ctrl.init)
router.get('/auth/callback',
  ctrl.authCallback,
  async (ctx) => {
    logger.debug({ message: 'Redirecting to serve html.' })
    const { shop } = ctx.request.query
    const storeIdentifier = shop.replace('.myshopify.com', '')

    ctx.redirect(`/?storeIdentifier=${storeIdentifier}`)
  }
)

router.get('/app-charge', ctrl.getAppCharge)
router.post('/create-recurring-charge', ctrl.createRecurringCharge)
router.all('/charge-accept-decline', ctrl.handleChargeAcceptDecline)

router.post('/cust/redact', async (ctx) => {
  logger.debug('Inside /cust/redact route')
  ctx.response.status = 200
})
router.post('/shop/delete', async (ctx) => {
  logger.debug('Inside /shop/delete route')
  ctx.response.status = 200
})
router.post('/cust/data', async (ctx) => {
  logger.debug('Inside /cust/data route')
  ctx.response.status = 200
  ctx.body = {}
})

module.exports = router
