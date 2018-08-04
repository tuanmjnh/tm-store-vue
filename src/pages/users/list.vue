<template>
  <div>List users</div>
</template>

<script>
export default {
    data() {
        return {}
    },
    beforeCreate() { },
    created() {
        this.$store.dispatch('users/select').then(() => { })
    },
}
</script>

<style>
</style>
