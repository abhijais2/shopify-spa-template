<template>
  <div v-loading.fullscreen.lock="loading">
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

      if (appCharge && appCharge.status === 'accepted') {
        this.$router.push({ name: 'home' })
      } else {
        let shopifyChargeResponse = await adaptor.createRecurringCharge()
        window.top.location.href = shopifyChargeResponse.confirmation_url
      }

      this.loading = false
    } catch (err) {
      console.log('error: ', err.message)
    }
  }
}
</script>
