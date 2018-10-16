const Agenda = require('agenda')
const logger = require('server/services/logger')
const { MONGODB_URI } = require('nconf').get('mongodb')
const collectionName = 'agenda-jobs'

const connectionOpts = { db: { address: MONGODB_URI, collection: collectionName } }

const agenda = new Agenda(connectionOpts)

require('./scheduler-jobs/alert')(agenda)

agenda.start()
  .then()
  .catch(err => {
    logger.error({
      message: 'Error in starting agenda',
      errMessage: err.message
    })
  })

agenda.on('start', job => {
  logger.info({ message: `start-event | job-name: ${job.attrs.name} | job-metadata: ${job.attrs.data}` })
})

agenda.on('success', job => {
  logger.info({ message: `success-event | job-name: ${job.attrs.name} | job-metadata: ${job.attrs.data}` })
})

agenda.on('fail', (err, job) => {
  logger.error({
    message: `fail-event | job-name: ${job.attrs.name} | job-metadata: ${job.attrs.data}`,
    errMessage: err.message
  })
})

module.exports = agenda
