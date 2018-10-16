const Router = require('koa-router')
const router = new Router()
const ctrl = require('./controller')

router.all('/alerts/*', async (ctx, next) => {
  if (!ctx.session || !ctx.session.store_identifier) ctx.throw(400, 'Seesion is not authenticated')
  await next()
})

router
  .get('/alerts', ctrl.getAll)
  .post('/alerts', ctrl.create)
  .get('/alerts/:id', ctrl.getById)
  .put('/alerts/:id', ctrl.updateById)
  .delete('/alerts/:id', ctrl.deleteById)

module.exports = router.routes()
