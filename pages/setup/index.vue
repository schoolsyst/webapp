<script>
/* Controller for the setup process that checks on which step to redirect the user to.
 * No actual content is here, except for the loading screen.
 */

export default {
  layout: 'bare',
  mounted() {
    this.$withLoadingScreen(async () => {
      // Convenience
      const { dispatch, state, getters } = this.$store
      /* Each step is:
       * - load the appropriate data
       * - check if the required data is here
       * - redirect to the appropriate step if checks failed
       */
      
      await dispatch('subjects/load')
      // The user should have at the minimum one subject.
      if (!state.subjects.subjects.length) 
        this.$router.push('/setup/subjects/')
      console.log('SETUP CHECKS:::SUBJECTS CHECK OK')

      await dispatch('settings/load')
      await dispatch('schedule/load')
      /* As schoolsyst is meant to be as easy to pick up mid-year as possible,
       * it is possible to use it without putting your schedule in.
       * While a lot of features (namely the Timeline, default due date & smart due date picker for homework)
       * will sadly be turned off, I felt like this was needed.
       * When the 'schedule-less' mode is on, some schedule-related settings are not required (mostly dates)
       * They should then not be required.
       */
      let scheduleLess = !getters['settings/value']('use_schedule')
      if (scheduleLess) console.log('SETUP CHECKS:::RUNNING IN SCHEDULE-LESS MODE')
      let missingScheduleSettings = state.settings.settings.filter(s => !s.optional && s.isDefaultValue && s.category === 'Emploi du temps')
      // The user should have at least one schedule event
      if (!scheduleLess && state.schedule.events.length < 0 && !missingScheduleSettings)
        this.$router.push('/setup/schedule/')
      console.log('SETUP CHECKS:::SCHEDULE CHECK OK')

      this.$router.push('/')
    })
  }
}
</script>

<template lang="pug">
  p Chargement...
</template>
