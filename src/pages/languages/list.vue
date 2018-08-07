<template>
  <div>
    <div v-for="(item, i) in items" :key="i">
      <p>{{item.name}}}</p>
    </div>
    <br/>
    <v-card>
      <v-card-title>
        <v-text-field v-model="query.search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip right>
          <v-btn slot="activator" color="primary" small fab flat @click="localDialog=!localDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" select-all item-key="name" :headers="headers"
        :items="fiter" :pagination.sync="query.pagination" :rows-per-page-items="rowPerPage"
        :total-items="totalItems">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.orders }}</td>
            <td>{{ FormatDate(props.item.created.at,'DD/MM/YYYY hh:mm',true) }}</td>
            <td>{{ props.item.flag }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="handleEdit(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="handleDelete(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="confirmDialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Message
        </v-card-title>
        <v-card-text>
          Are you sure?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="handleConfirm">
            I accept
          </v-btn>
          <v-btn color="secondary" flat @click="confirmDialog=false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { FBStore, timestamp } from '@/plugins/firebaseInit'
export default {
  props: { dialog: { type: Boolean, default: false } },
  data: () => ({
    localDialog: false,
    confirmDialog: false,
    loading: true,
    selected: [],
    totalItems: 0,
    items: [],
    // search: '',
    // pagination: {},
    rowPerPage: [5, 10, 25, 50, 100, { text: "All", value: -1 }],
    headers: [
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Orders', value: 'orders' },
      { text: 'Created', value: 'created.at' },
      { text: 'Flag', value: 'flag' },
      { text: '#', value: '#', sortable: false }
    ],
    query: {
      search: '',
      pagination: {}
    },
    editedIndex: -1
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    fiter() {
      // var query = {
      //   search: this.search,
      //   page: this.pagination.page,
      //   descending: this.pagination.descending,
      //   rowsPerPage: this.pagination.rowsPerPage,
      //   sortBy: this.pagination.sortBy,
      //   totalItems: this.pagination.totalItems,
      // }
      // var rs = this.$store.getters['languages/getFilter'](query)
      var rs = this.$store.state.languages.items
      return rs
    },
    getData() {
      var rs = this.$store.getters['languages/pagination'](this.query)
      console.log(rs)
      return rs
    }
  },
  watch: {
    query: {
      handler() {
        this.items = this.$store.dispatch('languages/pagination', this.query)
      },
      deep: true
    },
    // pagination: {
    //     handler() {
    //         this.getDataFromApi().then(data => {
    //             this.desserts = data.items
    //             this.totalDesserts = data.total
    //         })
    //     },
    //     deep: true
    // },
    // search: {
    //     handler() {
    //         this.getDataFromApi().then(data => {
    //             this.desserts = data.items
    //             this.totalDesserts = data.total
    //         })
    //     },
    //     deep: true
    // },
    items(val) {
      // this.totalItems = val.length
      // console.log(this.pagination)
    },
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('languages/item')
    }
  },
  created() {
    // this.$store.dispatch('languages/init')
    // this.$store.dispatch('languages/select')
    //{
    //     descending: this.pagination.descending,
    //     page: this.pagination.page,
    //     rowsPerPage: this.pagination.rowsPerPage,
    //     sortBy: this.pagination.sortBy,
    //     totalItems: this.pagination.totalItems
    // }
  },
  methods: {
    handleEdit(item) {
      this.$store.dispatch('languages/item', item)
      this.localDialog = true
    },
    handleDelete(item) {
      this.confirmDialog = true
      this.$store.dispatch('languages/item', item)
      console.log(this.$store.state.languages.item)
      // const index = this.desserts.indexOf(item)
      // confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },
    handleConfirm() {
      this.confirmDialog = false
      this.$store.dispatch('languages/delete')
    }
  }
}
</script>

<style>
</style>