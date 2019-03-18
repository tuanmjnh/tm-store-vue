<template>
  <div>
    <v-card>
      <v-card-title>
        <v-flex xs12 sm3 md3 class="mr-3">
          <v-select :items="languages" v-model="$store.state.dictionary.item.code"
            :hide-selected="true" item-text="title" item-value="code" :label="$store.getters.languages(['languages.title'])"></v-select>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-combobox v-model="$store.state.dictionary.item.group" :items="modules"
            item-text="code" item-value="code" :auto-select-first="true" :label="$store.getters.languages(['global.search'])"></v-combobox>
          <!-- <v-text-field v-model="pagination.search" append-icon="search" label="Search"
              single-line hide-details></v-text-field> -->
        </v-flex>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="localDialog=!localDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
        <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>List use</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=0">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>List delete</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.dictionary.selected"
        select-all item-key="name" :headers="headers" :items="items" :rows-per-page-items="rowPerPage">
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
              <v-btn v-if="pagination.flag===1" icon class="mx-0" @click="handleItems(props.item)">
                <i class="material-icons info--text">layers</i>
              </v-btn>
              <v-btn icon class="mx-0" @click="handleEdit(props.item)">
                <i class="material-icons teal--text">edit</i>
              </v-btn>
              <v-btn icon class="mx-0" @click="handleDelete(props.item)">
                <i v-if="pagination.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="confirmDialog" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$store.getters.languages('global.message')" :content="$store.getters.languages('messages.confirm_content')"
      :btnAcceptText="$store.getters.languages('global.accept')" :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  props: {
    dialog: { type: Boolean, default: false },
    itemsDialog: { type: Boolean, default: false },
  },
  data: () => ({
    loading: true,
    // totalItems: 0,
    // items: [],
    toggle_one: 0,
    localDialog: false,
    localItemsDialog: false,
    confirmDialog: false,
    pagination: { search: '', sortBy: 'orders', find: { flag: 1 } },
    // pagination: {},
    rowPerPage: [10, 25, 50, 100, { text: "All", value: -1 }],
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Code', value: 'code', align: 'left' },
      { text: 'Orders', value: 'orders' },
      { text: 'Created', value: 'created.at' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', sortable: false }
    ]
  }),
  created() {
    this.$store.dispatch('dictionary/init')
    // this.$store.dispatch('dictionary/select')
    //{
    //     descending: this.pagination.descending,
    //     page: this.pagination.page,
    //     rowsPerPage: this.pagination.rowsPerPage,
    //     sortBy: this.pagination.sortBy,
    //     totalItems: this.pagination.totalItems
    // }
  },
  computed: {
    items() {
      // var pagination = {
      // search: this.search,
      // page: this.pagination.page,
      // descending: this.pagination.descending,
      // rowsPerPage: this.pagination.rowsPerPage,
      // sortBy: this.pagination.sortBy,
      // totalItems: this.pagination.totalItems,
      // flag: 0
      // }
      const rs = this.$store.getters['dictionary/getFilter'](this.pagination)
      return rs
    },
    languages() {
      const rs = this.$store.getters['dictionary/getFilter']({ flag: 1 })
      return rs
    },
    modules() {
      const rs = ['global']
      return rs
    }
  },
  watch: {
    // pagination: {
    //   handler() {
    //     this.items = this.$store.dispatch('dictionary/pagination', this.pagination)
    //   },
    //   deep: true
    // },
    // items(val) {
    // this.totalItems = val.length
    // console.log(this.pagination)
    // },
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('dictionary/item')
    },
    itemsDialog(val) { this.localItemsDialog = val },
    localItemsDialog(val) { this.$emit('handleItemsDialog', val) }
  },
  methods: {
    onItems(item) {
      this.$store.dispatch('dictionary/item', item)
      this.localItemsDialog = !this.localItemsDialog
    },
    onEdit(item) {
      this.$store.dispatch('dictionary/item', item)
      this.localDialog = true
    },
    onDelete(item) {
      this.confirmDialog = !this.confirmDialog
      this.$store.state.dictionary.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('dictionary/delete')
    },
    onCFMCancel() {
      this.$store.state.dictionary.selected = []
    }
  }
}
</script>

<style>
</style>