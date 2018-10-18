module.exports = (agenda) => {
  agenda.define('alert', (job, done) => {
    console.log({
      messgae: 'Testing scheduler',
      name: job.attrs.name,
      data: job.attrs.data
    })
    done()
  })
}
