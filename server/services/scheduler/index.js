const agenda = require('./agenda/worker.js')
const logger = require('server/services/logger')

module.exports = {
  register (interval, { job_id, timezone }) {
    logger.info({
      message: 'inside register method of scheduler',
      job_id,
      timezone,
      interval
    })
    /*
    ** interval = '* * * * *' => minute(0-59) hour(0-23) day-of-month(1-31) month(1-12) day-of-week(0-7, o or 7 sunday)
    ** options: { job_id, job_type }
    */
    if (!interval) throw new Error('interval is required')
    if (!job_id) throw new Error('job_id is required')
    if (!timezone) throw new Error('timezone is required')

    const job = agenda.create('alert', { job_id })
    job.save(err => {
      if (err) {
        logger.error({
          message: 'Error while saving job',
          job_id,
          errMessage: err.message
        })
      }
    })

    job.repeatEvery(interval, {
      timezone,
      skipImmediate: true
    })
    job.save(err => {
      if (err) {
        logger.error({
          message: 'Error while creating job interval',
          job_id,
          errMessage: err.message
        })
      }
    })
  }
}
