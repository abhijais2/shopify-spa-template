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
    let result = await adaptor.isRecurringChargeEnabled()

    if (result.status) {
      this.$router.push({name: 'notifiers'})
    } else {
      window.top.location.href = result.confirmation_url
    }

    this.loading = false
  }
}
</script>
