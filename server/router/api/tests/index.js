const Router = require('koa-router')
const router = new Router()
const ctrl = require('./controller')

router.all('/tests/*', async (ctx, next) => {
  await next()
})

router
  .get('/tests', ctrl.getAll)

module.exports = router.routes()
