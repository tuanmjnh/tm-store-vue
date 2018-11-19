<template>
  <v-app>
    <template-snackbar></template-snackbar>
    <template-main v-if="isAuth"></template-main>
    <template-auth v-else></template-auth>
  </v-app>
</template>

<script>
import snackbar from './components/snackbar'
import auth from './layouts/vuetify/auth'
import main from './layouts/vuetify/main'
export default {
  name: 'App',
  components: {
    'template-snackbar': snackbar,
    'template-main': main,
    'template-auth': auth
  },
  data: () => ({
  }),
  mounted() {
  },
  created() {
  },
  computed: {
    isAuth() {
      var x = this.$store.state.$isAuth
      return x
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
</style>
