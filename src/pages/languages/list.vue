<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="pagination.search" append-icon="search" :label="$store.getters.languages('global.search')"
          single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.permissions.dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.add')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.languages.selected.length>0 && pagination.find.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.languages.selected.length>0 && pagination.find.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.recover_selected')}}</span>
        </v-tooltip>
        <v-menu bottom left>
          <v-btn slot="activator" icon>
            <i class="material-icons blue-grey--text">more_vert</i>
          </v-btn>
          <v-list>
            <v-list-tile @click="pagination.find.flag=1">
              <v-list-tile-action>
                <i class="v-icon material-icons">view_list</i>
              </v-list-tile-action>
              <v-list-tile-title class="pr-4">{{$store.getters.languages('global.using')}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="pagination.find.flag=0">
              <v-list-tile-action>
                <i class="v-icon material-icons">delete</i>
              </v-list-tile-action>
              <v-list-tile-title class="pr-4">{{$store.getters.languages('global.deleted')}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <!-- <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>List use</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.flag=0">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>List delete</span>
          </v-tooltip>
        </v-btn-toggle> -->
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.languages.selected" select-all item-key="id"
        :headers="headers" :items="items" :rows-per-page-items="rowPerPage" :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="pagination" :search="pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.code }}</td>
            <td>{{ props.item.orders }}</td>
            <td>{{ props.item.created_at|formatDate('DD/MM/YYYY hh:mm') }}</td>
            <td v-html="props.item.icon"></td>
            <td class="justify-center layout px-0">
              <!-- <v-tooltip bottom>
                <v-btn v-if="pagination.find.flag===1" icon class="mx-0" slot="activator"
                  @click="onItems(props.item)">
                  <i class="material-icons info--text">layers</i>
                </v-btn>
                <span>Details</span>
              </v-tooltip> -->
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="pagination.find.flag===1">
                <v-btn flat icon slot="activator" color="error" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.delete')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <v-btn flat icon slot="activator" color="info" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.recover')}}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="confirmDialog" @onAccept="onCFMAccept" @onCancel="onCFMCancel" :title="$store.getters.languages('global.message')"
      :content="$store.getters.languages('messages.confirm_content')" :btnAcceptText="$store.getters.languages('global.accept')"
      :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  props: {
    dialog: { type: Boolean, default: false },
    // itemsDialog: { type: Boolean, default: false },
  },
  data: () => ({
    loading: true,
    // totalItems: 0,
    // items: [],
    toggle_one: 0,
    localDialog: false,
    // localItemsDialog: false,
    confirmDialog: false,
    // query: { search: '', sort: 'orders', direction: 'asc', flag: 1 },
    pagination: { search: '', sortBy: 'orders', find: { flag: 1 } },
    rowPerPage: [5, 10, 25, 50, 100, { text: "All", value: -1 }],
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Code', value: 'code', align: 'left' },
      { text: 'Orders', value: 'orders', sortable: true },
      { text: 'Created', value: 'created.at' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', align: 'center', sortable: false }
    ]
  }),
  // mounted() {
  //   this.$store.dispatch('languages/init')
  // },
  created() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages(e.text) });
    if (this.$store.state.languages.isGetFirst) this.$store.dispatch('languages/select', true)
  },
  computed: {
    items() {
      var rs = this.$store.getters['languages/getFilter'](this.pagination)
      return rs
    }
  },
  methods: {
    onEdit(item) {
      this.$store.dispatch('languages/item', item)
      this.$store.state.languages.dialog = true
    },
    onDelete(item) {
      this.confirmDialog = !this.confirmDialog
      if (item) this.$store.state.languages.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('languages/delete')
    },
    onCFMCancel() {
      this.$store.state.languages.selected = []
    }
  }
}
</script>

<style>
</style>