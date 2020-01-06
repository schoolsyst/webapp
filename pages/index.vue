<template lang="pug">
  
</template>

<script>
export default {
  mounted() {
    let step = this.$auth.user.setup_step
    console.log(step)
    if (step) this.$router.push(`/setup/${step}`)
    else this.$router.push('/timeline')
  }
}
</script>
