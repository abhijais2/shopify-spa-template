const transporter = require('./transporter')
const logger = require('server/services/logger')
const EmailerError = require('./emailer-error')
const handlebarsParser = require('server/services/handlebarsParser')

module.exports = {
  Error: EmailerError,
  transporter,
  async send ({ paramMailOptions }) {
    try {
      /*
        ** from, to, subject, text, html
        paramMailOptions: {
          subject,
          html,
          to
        }
        globalMailOptions: {}

      */
      let localMailOptions = {}
      let mailOptions = {
        ...paramMailOptions,
        ...localMailOptions
      }

      logger.debug({ mailOptions })
      let toReturn = await transporter.sendMail(mailOptions)
      return toReturn
    } catch (err) {
      throw new EmailerError(`Failed to send email: ${err.message}`)
    }
  },

  async evalHandlebarsAndSend ({ paramMailOptions, paramHandlebarsContext = {} }) {
    evalHandlebarsForSubject({ paramMailOptions, paramHandlebarsContext })
    evalHandlebarsForBody({ paramMailOptions, paramHandlebarsContext })

    await this.send({ paramMailOptions })
  }
}

/* ------------------------Private Functions--------------------- */
const evalHandlebarsForBody = ({ paramMailOptions, paramHandlebarsContext }) => {
  // TODO: handle type of text and html
  paramMailOptions.html = handlebarsParser.evalTemplate({ template: paramMailOptions.html, paramContext: paramHandlebarsContext })
}

const evalHandlebarsForSubject = ({ paramMailOptions, paramHandlebarsContext }) => {
  paramMailOptions.subject = handlebarsParser.evalTemplate({ template: paramMailOptions.subject, paramContext: paramHandlebarsContext })
}
