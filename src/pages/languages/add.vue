<template>
  <v-dialog v-model="$store.state.languages.dialog" :persistent="loading" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title class="headline grey lighten-2">
        <span>{{ item.id ?$store.getters.languages('global.details'):$store.getters.languages('global.add') }}</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm8 md8>
                <v-text-field v-model="item.name" label="Name" :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 md4>
                <v-text-field v-model.trim="item.code" class="text-color-initial" :disabled="item.id?true:false"
                  :label="$store.getters.languages('global.code')" :rules="[v => !!v  || $store.getters.languages('error.required'), !exist_code||$store.getters.languages('error.exist')]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6 class="text-append-icon">
                <v-text-field v-model.trim="item.icon" label="Icon"></v-text-field>
                <div class="icon" v-html="item.icon"></div>
              </v-flex>
              <v-flex xs6 sm3 md3>
                <v-text-field type="number" v-model.trim="item.orders" :label="$store.getters.languages('global.orders')"
                  :rules="[v => !!v  || $store.getters.languages('error.required')]"></v-text-field>
              </v-flex>
              <v-flex xs6 sm3 md3>
                <v-switch color="primary" :label="item.flag===1?$store.getters.languages('global.use'):$store.getters.languages('global.draft')"
                  :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <quill-editor v-model="item.desc" ref="descriptions">
                </quill-editor>
                <!-- <tinymce id="desc" v-model="item.desc"></tinymce> -->
              </v-flex>
              <v-flex xs12 sm12 md12>
                <div class="dflex">
                  <a v-if="item.attach" class="white--text v-btn v-btn--outline v-btn--depressed blue-grey--text m-0"
                    :href="item.attach" target="_blank"><i class="material-icons">attach_file</i>
                    {{item.attach}}</a>
                  <v-spacer></v-spacer>
                  <uploadFirestoreFiles :multiple="false" button="Upload" :firebase="firebase" path="languages"
                    :rules="{extension:'.json'}" :data="upload_data" :error="upload_error"></uploadFirestoreFiles>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="loading">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.languages.dialog=false" :disabled="loading">
          {{$store.getters.languages('global.back')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import firebase from '@/plugins/firebaseInit'
import uploadFirestoreFiles from '@/components/upload-firestore-files'
export default {
  components: { quillEditor, uploadFirestoreFiles },
  data: () => ({
    loading: false,
    valid: false,
    exist_code: false,
    firebase: firebase,
    upload_data: {},
    upload_error: {},
  }),
  created() {
    this.$store.dispatch('languages/item')
  },
  computed: {
    item() {
      var rs = this.$store.state.languages.item
      return rs
    },
    dialog() {
      var rs = this.$store.state.languages.dialog
      return rs
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.$store.dispatch('languages/item')
      this.$refs.form.resetValidation()
    },
    item: {
      handler(val) {
        //if (this.item.attach) this.item.attach = this.item.attach.replace('Languages/', '')
        if (this.item.code && !this.item.id) this.$store.dispatch('languages/exist_code').then((rs) => { this.exist_code = rs })
      },
      deep: true
    },
    upload_data: {
      handler(val) {
        console.log(val.data)
      }, deep: true
    },
    upload_error: {
      handler(val) {
        console.log(val)
      }, deep: true
    }
  },
  methods: {
    onSave() {
      this.loading = true
      this.item.attach = this.upload_data.path ? this.upload_data.path : ''
      if (this.item.id) this.$store.dispatch('languages/update').then(this.loading = false)
      else this.$store.dispatch('languages/insert').then(() => {
        this.loading = false
        this.$refs.form.resetValidation()
      })
    }
  }
}
</script>

<style>
</style>
