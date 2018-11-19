<template>
  <v-dialog v-model="localDialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm8 md8>
              <v-text-field v-model="item.name" label="Name"></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-text-field v-model="item.code" label="Code"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="item.icon" label="Icon"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="item.orders" label="Orders"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-switch color="primary" :label="item.flag===1?'Show':'Hide'" :true-value="1"
                :false-value="0" v-model.number="item.flag"></v-switch>
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
                  {{item.attach|pathToFileName}}</a>
                <v-spacer></v-spacer>
                <uploadFirestoreFiles :multiple="false" button="Upload" :firebase="firebase"
                  path="languages" :rules="{extension:'.json'}" :data="uploadData" :error="uploadError"></uploadFirestoreFiles>
              </div>
            </v-flex>
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import firebase from '@/plugins/firebaseInit'
import uploadFirestoreFiles from '@/components/upload-firestore-files'
export default {
  components: { quillEditor, uploadFirestoreFiles },
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    localDialog: false,
    editedIndex: -1,
    firebase: firebase,
    uploadData: {},
    uploadError: {},
  }),
  mounted() {
    this.$store.dispatch('languages/item')
  },
  computed: {
    formTitle() {
      return this.$store.state.languages.item.id ? 'Edit Item' : 'New Item'
    },
    item() {
      var item = this.$store.state.languages.item
      return item
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('languages/item')
    },
    uploadData: {
      handler(val) {
        console.log(val.data)
      }, deep: true
    },
    uploadError: {
      handler(val) {
        console.log(val)
      }, deep: true
    }
  },
  methods: {
    onSave() {
      this.item.attach = this.uploadData.path
      if (this.item.id) this.$store.dispatch('languages/update')
      else this.$store.dispatch('languages/insert')
    },
    onCheck() {
      var a = Object
      return a
    }
  }
}
</script>

<style>
</style>
