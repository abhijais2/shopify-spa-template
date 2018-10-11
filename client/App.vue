<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import ShopifyApp from 'ShopifyApp'

export default {
  data () {
    return {}
  },

  created () {
    const shopifyAppConfig = {
      apiKey: window.api_key,
      shopOrigin: `https://${window.store_identifier}.myshopify.com`,
      debug: true,
      forceRedirect: true
    }

    ShopifyApp.init(shopifyAppConfig)
  }
}
</script>
