const fs = require('fs')

const servicesConfig = fs
  .readdirSync(__dirname)
  .reduce((result, filename) => {
    if (!/index/.test(filename)) {
      const configName = filename.replace('.js', '')
      const config = require(`${__dirname}/${filename}`)

      result[configName] = config
    }
    return result
  }, {})

module.exports = servicesConfig
