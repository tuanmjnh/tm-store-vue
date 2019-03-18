<template>
  <div class="mid-center" v-if="$store.state.$loading">
    <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
    <list :dialog="dialog" :itemsDialog="itemsDialog" @handleDialog="dialog=$event"
      @handleItemsDialog="itemsDialog=$event"></list>
    <add :dialog="dialog" @handleDialog="dialog=$event"></add>
  </div>
</template>

<script>
import list from './list'
import add from './add'
export default {
  components: { list, add },
  data: () => ({
    dialog: false,
    itemsDialog: false
  })
}
</script>

<style>
</style>
