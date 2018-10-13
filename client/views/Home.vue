<template>
  <div>
    Welcome!!
  </div>
</template>

<script>
import ShopifyApp from 'ShopifyApp'

export default {
  async created () {
    console.log('check 5 ======')
    let vm = this

    ShopifyApp.ready(function () {
      ShopifyApp.Bar.initialize({
        title: 'Notifiers',
        buttons: {
          primary: {
            label: 'New',
            callback: function () {
              vm.$router.push({ name: 'notifiers-new' })
            }
          }
        }
      })

      ShopifyApp.Bar.loadingOff()
    })
  }
}
</script>
