const Router = require('koa-router')
const router = new Router()

const tests = require('./tests')

router.all('*', async (ctx, next) => {
  await next()
})

router.use(tests)

module.exports = router
