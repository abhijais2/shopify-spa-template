const { Store } = rootRequire('server/models')


module.exports = {
  async getAll (ctx) {
    ctx.body = await Store.find().exec()
  },

  async getById (ctx) {
    ctx.body = await Store.findById(ctx.params.id).exec()
  },

  async updateById (ctx) {
    let id = ctx.params.id
    let data = ctx.request.fields
    let options = { new: true }

    ctx.body = await Store.findByIdAndUpdate(id, data, options).exec()
  },

  async create (ctx) {
    let data = ctx.request.fields
    ctx.body = await Store.create(data)
  },

  async deleteById (ctx) {
    ctx.body = await Store.findByIdAndRemove(ctx.params.id).exec()
  }
}
