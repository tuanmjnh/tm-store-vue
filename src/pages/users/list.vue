<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="query.search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="localDialog=!localDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
        <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="query.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>List use</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="query.flag=0">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>List delete</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" select-all item-key="name" :headers="headers"
        :items="items" :rows-per-page-items="rowPerPage">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.orders }}</td>
            <td>{{ FormatDate(props.item.created_at,'DD/MM/YYYY hh:mm',true) }}</td>
            <td v-html="props.item.icon"></td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="handleEdit(props.item)">
                <i class="material-icons teal--text">edit</i>
              </v-btn>
              <v-btn icon class="mx-0" @click="handleDelete(props.item)">
                <i v-if="query.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
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
export default {
    props: { dialog: { type: Boolean, default: false } },
    data: () => ({
        loading: true,
        selected: [],
        toggle_one: 0,
        localDialog: false,
        confirmDialog: false,
        query: { search: '', flag: 1 },
        rowPerPage: [5, 10, 25, 50, 100, { text: "All", value: -1 }],
        headers: [
            { text: 'Name', value: 'name', align: 'left' },
            { text: 'Orders', value: 'orders' },
            { text: 'Created', value: 'created.at' },
            { text: 'Icon', value: 'icon' },
            { text: '#', value: '#', sortable: false }
        ]
    }),
    computed: {
        items() {
            var rs = this.$store.getters['users/getFilter'](this.query)
            return rs
        }
    },
    watch: {
        dialog(val) { this.localDialog = val },
        localDialog(val) {
            this.$emit('handleDialog', val)
            if (!val) this.$store.dispatch('users/item')
        }
    },
    created() {
        this.$store.dispatch('users/init')
    },
    methods: {
        handleList(flag) {

        },
        handleEdit(item) {
            this.$store.dispatch('users/item', item)
            this.localDialog = true
        },
        handleDelete(item) {
            this.confirmDialog = true
            this.$store.dispatch('users/item', item)
        },
        handleConfirm() {
            this.confirmDialog = false
            this.$store.dispatch('users/delete')
        }
    }
}
</script>

<style>
</style>