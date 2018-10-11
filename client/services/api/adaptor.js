import axios from 'axios'

export default {
  async getAppCharge () {
    let response = await axios({
      method: 'get',
      url: '/adaptor/app-charge'
    })
    return response.data
  },

  async createRecurringCharge () {
    let response = await axios({
      method: 'post',
      url: '/adaptor/create-recurring-charge'
    })
    return response.data
  }
}
