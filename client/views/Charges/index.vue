<template>
  <div>
    .
  </div>
</template>

<script>
import adaptor from '@/services/api/adaptor'

export default {
  data () {
    return {
      loading: true
    }
  },

  async created () {
    try {
      let appCharge = await adaptor.getAppCharge()
      console.log('check 1 appCharge', appCharge)
      if (appCharge && appCharge.status === 'accepted') {
        console.log('check 4')
        this.$router.push({ name: 'home' })
      } else {
        console.log('check 2')
        let shopifyChargeResponse = await adaptor.createRecurringCharge()
        console.log('check 3 shopifyChargeResponse', shopifyChargeResponse)
        window.top.location.href = shopifyChargeResponse.confirmation_url
      }

      this.loading = false
    } catch (err) {
      console.log('error: ', err.message)
    }
  }
}
</script>
