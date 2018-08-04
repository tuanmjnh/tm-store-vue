<template>
  <v-app>
    <v-navigation-drawer permanent :mini-variant="miniVariant" :clipped="clipped" v-model="drawer"
      enable-resize-watcher fixed app>
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              TM Store
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <template v-for="(item, i) in items">
        <v-list-tile v-if="!item.children" :key="i" value="true" @click="MenuAction(item)">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-group v-else :key="i" value="true" :prepend-icon="item.icon" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-title>Users</v-list-tile-title>
          </v-list-tile>
          <!-- <v-list-tile v-for="(children, ii) in item.children" :key="ii" @click="MenuAction(item.children)">
            <v-list-tile-title v-text="children.title"></v-list-tile-title>
            <v-list-tile-action>
              <v-icon v-text="children.icon"></v-icon>
            </v-list-tile-action>
          </v-list-tile> -->
        </v-list-group>
      </template>
    </v-navigation-drawer>
    <v-toolbar app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <!-- <HelloWorld/> -->
      <router-view></router-view>
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
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{ icon: 'home', title: 'Dashboard', push: 'dashboard' },
      {
        icon: 'account_circle',
        title: 'Users',
        push: 'users',
        children: [
          { icon: 'add', title: 'Create', push: 'users/add' },
          { icon: 'update', title: 'Update', push: 'users/update' },
          { icon: 'delete', title: 'Delete', push: 'users/delete' },
        ]
      },
      {
        icon: 'outlined_flag',
        title: 'Languages',
        push: 'languages',
        children: [
          { icon: 'add', title: 'Create', push: 'languages/add' },
          { icon: 'update', title: 'Update', push: 'languages/update' },
          { icon: 'delete', title: 'Delete', push: 'languages/delete' },
        ]
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  methods: {
    MenuAction(item) {
      if (item.store) this.$store.commit(item.store);
      if (item.go) this.$router.go('/' + item.go);
      else this.$router.push('/' + item.push);
    }
  }
}
</script>
