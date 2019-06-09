<template>
  <v-dialog v-model="$store.state.dictionary.dialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ $store.state.dictionary.item.id ? 'Edit Item' : 'New Item'}}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm8 md8>
                <v-text-field v-model.trim="item.code" label="Code" :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model.trim="item.icon" label="Key"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model.trim="item.orders" label="Vaule"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-switch color="primary" :label="item.flag===1?'Show':'Hide'" :true-value="1" :false-value="0"
                  v-model.number="item.flag"></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="handleSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
          <!-- <i class="material-icons">check</i> -->
          Update
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.dictionary.dialog=false">
          <!-- <i class="material-icons">close</i>  -->
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { FBStore, timestamp } from '@/plugins/firebaseInit'
export default {
  data: () => ({
    valid: false
  }),
  mounted() {
    this.reset()
  },
  computed: {
    dialog() {
      return this.$store.state.dictionary.dialog
    },
    item() {
      return this.$store.state.dictionary.item
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
    }
  },
  methods: {
    handleSave() {
      if (this.item.id) this.$store.dispatch('dictionary/update')
      else this.$store.dispatch('dictionary/insert')
    },
    reset() {
      this.$store.commit('dictionary/SET_ITEM')
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
