const Router = require('koa-router')
const router = new Router()
const ctrl = require('./controller')

router.all('/stores/*', async (ctx, next) => {
  await next()
})

router
  .get('/stores', ctrl.getAll)
  .post('/stores', ctrl.create)
  .get('/stores/:id', ctrl.getById)
  .put('/stores/:id', ctrl.updateById)
  .delete('/stores/:id', ctrl.deleteById)

module.exports = router.routes()
