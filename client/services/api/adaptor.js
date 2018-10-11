import axios from 'axios'

export default {
  async getAppCharge () {
    try {
      let response = await axios({
        method: 'get',
        url: '/adaptor/app-charge'
      })
      return response.data
    } catch (err) {
      console.log('err getAppCharge: ', err.message)
      return false
    }
  },

  async createRecurringCharge () {
    try {
      let response = await axios({
        method: 'post',
        url: '/adaptor/create-recurring-charge'
      })
      return response.data
    } catch (err) {
      console.log('err createRecurringCharge: ', err.message)
      return false
    }
  }
}
