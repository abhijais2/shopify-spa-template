const scheduler = require('server/services/scheduler')

module.exports = {
  async getAll (ctx) {
    ctx.body = ['list of all test files']
  },
  async scheduler_register (ctx) {
    scheduler.register('1-59/1 * * * *', {
      job_id: ctx.request.fields.job_id,
      timezone: 'America/New_York'
    })
  }
}
