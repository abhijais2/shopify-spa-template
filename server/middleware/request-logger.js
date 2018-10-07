const logger = require('../services/logger')

module.exports = () => {
  return async function requestLogger (ctx, next) {
    logger.info(`-------------------------------------------------`)
    logger.info(`${ctx.method} - ${ctx.url}`)
    logger.debug({ data: ctx.request ? ctx.request.fields : null })
    let startTime = new Date()
    await next()
    let endTime = new Date()
    logger.info(`API hit time duration: ${endTime - startTime}ms`)
  }
}
