<template>
  <v-app>
    <div class="mid-center" v-if="$store.state.$loadingApp">
      <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
    </div>
    <template v-else>
      <template-snackbar></template-snackbar>
      <template-main v-if="authenticated"></template-main>
      <template-auth v-else></template-auth>
    </template>
  </v-app>
</template>

<script>
import snackbar from './components/snackbar'
import auth from './layouts/vuetify/auth'
import main from './layouts/vuetify/main'
import * as storageAuth from './plugins/storage-auth'
export default {
  name: 'App',
  components: {
    'template-snackbar': snackbar,
    'template-main': main,
    'template-auth': auth
  },
  data: () => ({}),
  created() {
    // Get Languages
    this.$store.dispatch('languages/init')
    // Get Dictionary
    this.$store.dispatch('dictionary/init')
    // Check Auth
    this.$store.dispatch('auth/setAuthenticated', storageAuth.Authenticated())
  },
  computed: {
    authenticated() {
      const rs = this.$store.state.auth.authenticated
      return rs
    }
  },
  watch: {
    //authenticated(val) {
    //if(this.$route.path === '/auth') 
    //console.log(this.$route.path)
    //if (val && this.$route.path === '/auth') this.$router.push('/')
    //}
  },
  methods: {
  }
}
</script>
<style lang="scss">
</style>
