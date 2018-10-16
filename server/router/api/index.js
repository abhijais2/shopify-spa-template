const Router = require('koa-router')
const router = new Router()

const tests = require('./tests')
const alerts = require('./alerts')

router.all('*', async (ctx, next) => {
  await next()
})

router.use(tests)
router.use(alerts)

module.exports = router
