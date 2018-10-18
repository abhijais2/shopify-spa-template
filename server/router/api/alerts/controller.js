const { Alerts } = require('server/models')

module.exports = {
  async getAll (ctx) {
    ctx.body = await Alerts.find({ store_identifier: ctx.session.store_identifier }).exec()
  },

  async getById (ctx) {
    ctx.body = await Alerts.findById(ctx.params.id).exec()
  },

  async updateById (ctx) {
    let id = ctx.params.id
    let data = ctx.request.fields
    let options = { new: true }

    ctx.body = await Alerts.findByIdAndUpdate(id, data, options).exec()
  },

  async create (ctx) {
    let data = ctx.request.fields
    data.store_identifier = ctx.session.store_identifier
    ctx.body = await Alerts.create(data)
  },

  async deleteById (ctx) {
    ctx.body = await Alerts.findByIdAndRemove(ctx.params.id).exec()
  }
}
