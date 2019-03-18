<template>
  <v-dialog v-model="localDialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ $store.state.dictionary.item.id ? 'Edit Item' : 'New Item' }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="item.key" label="Group"></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-text-field v-model="formData.key" label="Key"></v-text-field>
            </v-flex>
            <v-flex xs12 sm8 md8>
              <v-text-field v-model="formData.value" label="Value"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <template v-for="(v, k) in item.value" class="">
              <div class="flex xs12 sm4 md4" :key="k">
                <div class="v-input v-text-field">
                  <div class="v-input__control">
                    <div class="v-input__slot">
                      <div class="v-text-field__slot">
                        <input type="text" :value="k" placeholder="Key" @change="onChangeKey(k, $event.target.value)">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex xs12 sm7 md7" :key="k+v">
                <div class="v-input v-text-field">
                  <div class="v-input__control">
                    <div class="v-input__slot">
                      <div class="v-text-field__slot">
                        <input type="text" :value="v" placeholder="Value" @change="onChangeValue(k, $event.target.value)">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="spacer" :key="k+'spacer'"></div>
              <div :key="k+'btn'" style="position:relative;top:3px">
                <v-btn color="error" small fab flat><i class="material-icons">close</i></v-btn>
              </div>
            </template>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onCheck">
          <!-- <i class="material-icons">check</i> -->
          Check
        </v-btn>
        <v-btn color="primary" flat @click.native="onSave">
          <!-- <i class="material-icons">check</i> -->
          Update
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false">
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
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    localDialog: false,
    editedIndex: -1,
    value: {},
    formData: {
      key: '',
      value: ''
    }
  }),
  created() {
    this.$store.dispatch('dictionary/item')
  },
  computed: {
    item() {
      var item = this.$store.state.dictionary.item
      return item
    },
    values() {
      var item = this.$store.state.dictionary.values
      return item
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('dictionary/item')
    }
  },
  methods: {
    onSave() {
      // var key = 'test'
      // this.item.value = { [this.formData.key]: this.formData.value }
      // this.item.value[key] = this.formData.value
      // console.log(this.item.value)
      this.item.value = this.values
      if (this.item.id) this.$store.dispatch('dictionary/update')
      else this.$store.dispatch('dictionary/insert')
    },
    onCheck() {
      console.log(this.item.value)
    },
    onChangeKey(valOld, valNew) {
      var val = this.values[valOld]
      delete this.values[valOld]
      this.values[valNew] = val
    },
    onChangeValue(key, valNew) {
      this.values[key] = valNew
    }
  }
}
</script>

<style>
</style>
