<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="pagination.search" append-icon="search" :label="$store.state.dictionary.items.search"
          single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="localDialog=!localDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
        <v-menu bottom left>
          <v-btn slot="activator" icon>
            <i class="material-icons blue-grey--text">more_vert</i>
          </v-btn>
          <v-list>
            <v-list-tile @click="pagination.flag=1">
              <v-list-tile-action>
                <i class="v-icon material-icons">view_list</i>
              </v-list-tile-action>
              <v-list-tile-title class="pr-4">List use</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="pagination.flag=0">
              <v-list-tile-action>
                <i class="v-icon material-icons">delete</i>
              </v-list-tile-action>
              <v-list-tile-title class="pr-4">List delete</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" select-all item-key="id"
        :headers="headers" :items="items" :rows-per-page-items="rowPerPage"
        :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="pagination" :search="pagination.search">
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.key }}</td>
            <td>{{ props.item.value }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn icon class="mx-0" slot="activator" @click="onEdit(props.item)">
                  <i class="material-icons teal--text">edit</i>
                </v-btn>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom v-if="pagination.flag===1">
                <v-btn icon class="mx-0" slot="activator" @click="onDelete(props.item)">
                  <i class="material-icons error--text">delete</i>
                </v-btn>
                <span>Delete</span>
              </v-tooltip>
              <v-tooltip bottom v-if="pagination.flag===0">
                <v-btn icon class="mx-0" slot="activator" @click="onDelete(props.item)">
                  <i class="material-icons info--text">refresh</i>
                </v-btn>
                <span>Recover</span>
              </v-tooltip>
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
          <v-btn color="primary" flat @click="onConfirm">
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
export default {
  props: {
    dialog: { type: Boolean, default: false },
    // itemsDialog: { type: Boolean, default: false },
  },
  data: () => ({
    loading: true,
    selected: [],
    toggle_one: 0,
    localDialog: false,
    confirmDialog: false,
    pagination: { search: '', sortBy: 'key', flag: 1 },
    rowPerPage: [10, 25, 50, 100, { text: "All", value: -1 }],
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'Key', value: 'key', align: 'left' },
      { text: 'Value', value: 'value', align: 'left' },
      { text: '#', value: '#', sortable: false }
    ]
  }),
  mounted() {
    this.$store.dispatch('dictionary/init')
  },
  computed: {
    items() {
      var rs = this.$store.getters['dictionary/getFilter'](this.pagination)
      return rs
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('dictionary/item')
    },
  },
  methods: {
    onEdit(item) {
      this.$store.dispatch('dictionary/item', item)
      this.$store.dispatch('dictionary/values', item.value)
      this.localDialog = true
    },
    onDelete(item) {
      this.confirmDialog = true
      this.$store.dispatch('dictionary/item', item)
    },
    onConfirm() {
      this.confirmDialog = false
      this.$store.dispatch('dictionary/delete')
    }
  },
  // created() {
  //   console.log(this.$store.state.dictionary.items)
  // }
}
</script>

<style>
</style>