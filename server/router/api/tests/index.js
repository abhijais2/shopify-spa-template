const Router = require('koa-router')
const router = new Router()
const ctrl = require('./controller')

router.all('/tests/*', async (ctx, next) => {
  await next()
})

router
  .get('/tests', ctrl.getAll)
  .post('/tests/scheduler_register', ctrl.scheduler_register)

module.exports = router.routes()
