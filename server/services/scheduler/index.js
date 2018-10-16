agenda = require('./agenda/worker.js')

module.exports = {
  register (interval, options) {
    if (!interval) throw new Error('interval is required')
    if (!options || !options.job_identifier) throw new Error('job_identifier is required')

    
  }
}
