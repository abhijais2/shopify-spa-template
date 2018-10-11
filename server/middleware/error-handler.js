function configureAndSendErrorToClient (err, ctx) {
  const message = err.message || 'Something bad happened'

  ctx.send(err.status || 500, {
    statusCode: 'FAILED',
    statusMessage: message
  })
}

module.exports = () => {
  return async function ErrorHandler (ctx, next) {
    try {
      await next()
      if (ctx.status < 200 || ctx.status >= 400) ctx.throw(ctx.status)
    } catch (err) {
      configureAndSendErrorToClient(err, ctx)
      ctx.app.emit('error', err, ctx)
    }
  }
}
