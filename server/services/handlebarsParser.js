const Handlebars = require('handlebars')
const logger = require('server/services/logger')
const defaultContext = {}

module.exports = {
  evalTemplate ({ template, paramContext = {} }) {
    try {
      if (!template) return template
      let context = Object.assign(paramContext, defaultContext)

      let compiledTemplate = Handlebars.compile(template)
      let toReturn = compiledTemplate(context)

      return toReturn
    } catch (err) {
      logger.error({
        message: 'Failed in evalTemplate of handlerbar parser',
        error: err.message
      })
      return template
    }
  }
}

Handlebars.registerHelper('compare', function (lvalue, rvalue, options) {
  if (arguments.length < 3) throw new Error("Handlerbars Helper 'compare' needs 2 parameters")

  var operator = options.hash.operator || '=='

  var operators = {
    '==': function (l, r) { return l === r },
    '===': function (l, r) { return l === r },
    '!=': function (l, r) { return l !== r },
    '<': function (l, r) { return l < r },
    '>': function (l, r) { return l > r },
    '<=': function (l, r) { return l <= r },
    '>=': function (l, r) { return l >= r },
    'typeof': function (l, r) { return typeof l === typeof r }
  }

  if (!operators[operator]) throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ` + operator)

  var result = operators[operator](lvalue, rvalue)

  if (result) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})
