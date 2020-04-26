<template lang="pug">
  
</template>

<script>
export default {
  layout: 'bare',
  mounted() {
    this.$withLoadingScreen(
      async () => {
        await this.$auth.fetchUser()
        const step = this.$auth.user.setup_step
        console.log(step)
        if (step) this.$router.push(`/setup/${step}`)
        else {
          await this.$store.dispatch('schedule/load')
          if (this.$store.getters['schedule/upcomingCourse'] !== null) {
            this.$router.push('/timeline')
          } else {
            this.$router.push('/homework')
          }
        }
      },
      {
        title: 'Veuillez patienter...',
        subtitle: "On vérifie que tout soit bien dans l'ordre",
      }
    )
  },
}
</script>
