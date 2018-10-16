const Agenda = require('agenda')
const { AGENDA_COLLECTION } = require('nconf').get('agenda')

const connectionOpts = {
  db: {
    address: 'localhost:27017/agenda-test',
    collection: AGENDA_COLLECTION
  } }
