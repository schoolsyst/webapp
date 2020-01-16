<template lang="pug">
  
</template>

<script>
export default {
  layout: 'bare',
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$auth.fetchUser()
      let step = this.$auth.user.setup_step
      console.log(step)
      if (step) this.$router.push(`/setup/${step}`)
      else this.$router.push('/timeline')
    }, { title: 'Veuillez patienter...', subtitle: 'On vérifie que tout soit bien dans l\'ordre'})
  }
}
</script>
