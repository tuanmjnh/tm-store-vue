<template>
  <div>
    <!--temporary-->
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer"
      enable-resize-watcher fixed app>
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>store</v-icon>
            </v-list-tile-action>
            <v-list-tile-content class="title">
              <v-list-tile-title>TM Store</v-list-tile-title>
            </v-list-tile-content>
            <!-- <v-list-tile-title class="title">
              TM Store
            </v-list-tile-title> -->
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <template v-for="(item, i) in items">
          <v-list-tile v-if="!item.children" :key="i" @click="MenuAction(item)">
            <v-list-tile-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group v-else :key="i" :prepend-icon="item.icon" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile>
            <template v-if="item.children">
              <v-list-tile v-for="(children, ii) in item.children" :key="ii" @click="MenuAction(children)">
                <v-list-tile-title v-text="children.title"></v-list-tile-title>
                <v-list-tile-action>
                  <v-icon v-text="children.icon"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app :clipped-left="clipped">
      <v-toolbar-side-icon v-if="clipped" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn v-if="!clipped" icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title"></v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="ShowSnackbar">
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>apps</v-icon>
      </v-btn>
      <v-menu bottom :min-width="166">
        <v-btn slot="activator" flat>
          Admin
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <!-- <v-list>
          <v-list-tile v-for="(item, i) in menuUser" :key="i" @click="MenuAction(item)">
            <v-list-tile-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list> -->
        <v-list>
          <v-list-tile @click="$router.push('/profile')">
            <v-list-tile-action>
              <i class="material-icons">ballot</i>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Profile</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="$router.push('/setting')">
            <v-list-tile-action>
              <i class="material-icons">settings_applications</i>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Setting</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="signOut">
            <v-list-tile-action>
              <i class="material-icons">exit_to_app</i>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <!-- <HelloWorld/> -->
      <div class="container page">
        <router-view></router-view>
      </div>
    </v-content>
    <v-navigation-drawer temporary :right="right" v-model="rightDrawer" fixed app>
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </div>
</template>

<script>
import { FBAuth } from "@/plugins/firebaseInit.js"
export default {
  // name: 'vuetify',
  components: {
  },
  data: () => ({
    // clipped: this.$vuetify.breakpoint.lgAndUp,
    drawer: true,
    fixed: false,
    right: true,
    miniVariant: false,
    rightDrawer: false,
    items: [
      { icon: 'home', title: 'Dashboard', push: 'dashboard' },
      {
        icon: 'developer_board',
        title: 'Manager',
        push: 'users',
        children: [
          { icon: 'account_circle', title: 'Users', push: 'users' },
          { icon: 'vpn_key', title: 'Roles', push: 'roles' },
          { icon: 'apps', title: 'Modules', push: 'modules' },
        ]
      },
      {
        icon: 'vertical_split',
        title: 'Common',
        push: 'languages',
        children: [
          { icon: 'outlined_flag', title: 'languages', push: 'languages' },
          { icon: 'font_download', title: 'dictionary', push: 'dictionary' },
          { icon: 'local_library', title: 'Informations', push: 'informations' }
        ]
      }],
    menuUser: [
      { icon: "ballot", title: "Profile", push: "profile" },
      { icon: "settings_applications", title: "Setting", push: "setting" },
      { icon: "exit_to_app", title: "Logout", go: "auth", store: "auth/logout" }
    ]
  })
  ,
  computed: {
    clipped() {
      var mobile = !this.$vuetify.breakpoint.lgAndUp
      return mobile
    }
  },
  methods: {
    MenuAction(item) {
      if (item.store) this.$store.commit(item.store)
      if (item.go) this.$router.go('/' + item.go)
      else this.$router.push('/' + item.push)
    },
    signOut() {
      this.$store.dispatch('auth/signOut', true).then(this.$router.push('/auth'))
      // var $this = this
      // FBAuth.signOut().then(function () {
      //   $this.$store.state.$isAuth = false
      //   $this.$router.push("/auth")
      // }, function (error) {
      //   $this.$store.dispatch('message', { text: error.message, color: 'error' })
      // })
    },
    ShowSnackbar() {
      this.$store.state._message.show = true
      this.$store.state._message.text = 'Message'
      var a = this.$store.state._message.show
      // console.log(a)
    }
  },
  created() {
    // this.$store.dispatch('languages_items/init')
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/vuetify.scss"
</style>
