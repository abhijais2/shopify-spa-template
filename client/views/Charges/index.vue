<template>
  <div v-loading="loading">
    <div v-if="fatal_err">
      Something went wrong, please contact support.
    </div>
    <div v-else>
      .
    </div>
  </div>
</template>

<script>
import adaptor from '@/services/api/adaptor'

export default {
  data () {
    return {
      loading: true,
      fatal_err: false
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
      this.fatal_err = true
      this.loading = false
    }
  }
}
</script>
