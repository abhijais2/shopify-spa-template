import axios from 'axios'

export default {
  async isRecurringChargeEnabled () {
    try {
      let response = await axios({
        method: 'get',
        url: '/adaptor/recurring-charge-enabled'
      })
      return response.data
    } catch (err) {
      console.log('err isRecurringChargeEnabled: ', err.message)
      return false
    }
  }
}
