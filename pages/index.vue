<template lang="pug">
  
</template>

<script>
export default {
  mounted() {
    if (this.$auth.user.is_setup) {
      this.$router.push('/timeline')
    } else {
      this.$router.push('/setup')
    }
  }
}
</script>
