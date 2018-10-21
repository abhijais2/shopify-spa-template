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
    let api_key = window.api_key
    let store_identifier = window.store_identifier

    const shopifyAppConfig = {
      apiKey: api_key,
      shopOrigin: `https://${store_identifier}.myshopify.com`,
      debug: true,
      forceRedirect: process.env.NODE_ENV !== 'development'
    }

    ShopifyApp.init(shopifyAppConfig)
  }
}
</script>
