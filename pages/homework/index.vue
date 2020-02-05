<template lang="pug">
    //TODO@ROADMAP: drag homework cards to change due date
    .container
        ModalAddHomework(
          v-model="homework.adding"
          @submit="post({homework: homework.adding, force: true}); homework.adding = homework.defaults"
          action="add"
        )
        ModalAddHomework(
          v-model="homework.editing"
          @submit="patch({modifications: homework.editing, uuid: homework.editing.uuid})"
          @delete="del({ uuid: homework.editing.uuid })"
          action="edit"
        )
        .grades-wrapper(v-if="grouped.filter(g => _needToShowGroup()({...g, showCompleted})).length")
            InputSetting.show-completed-exercises(
              _key="show_completed_exercises"
              type="BOOLEAN"
              name="Voir les exercices complétés"
              :value="showCompleted"
            )
            ul.homework-groups
                li.group.add-new
                    ul.homework
                        li
                            .card.new(@click="$modal.show('add-homework')")
                              Icon.icon add
                li.group(
                    v-for="group in grouped.filter(g => _needToShowGroup()({...g, showCompleted}))" :key="group.due"
                    :class="{ 'all-done': group.homeworks.filter(o => o.progress < 1).length == 0 }"
                )
                    HeadingSub 
                        span.due.late(v-if="group.due === 'LATE'") En retard
                        span.due(v-else :class="{today: isToday(group.due)}") {{ compoundDate(group.due) }}
                        button.mark-all-as-done(
                            v-tooltip="'Tout marquer comme terminé'"
                            @click="markAllAsDone(group.homeworks)"
                        ): Icon done_all
                    ul.homework
                        li(v-for="hw in group.homeworks", :key="hw.uuid")
                            CardHomework(
                              v-bind="hw"
                              @click="homework.editing = hw; $modal.open('edit-homework')"
                              @contextmenu.prevent="$refs.menu.open($event, { hw })"
                            )
        ScreenEmpty.empty(v-else @cta="$modal.show('add-homework')" @cta-secondary="setSetting({ key: 'show_completed_exercises', value: true })")
            template(#smiley) \o/
            p Bravo. Vous n'avez plus rien à travailler, pour le moment.
            template(#cta) Ajouter des devoirs
            template(#cta-secondary v-if="grouped.length > 0") Voir les devoirs terminés
        vue-context(
            ref="menu" 
            :close-on-click="true" 
            :close-on-scroll="true"
        )
            template(slot-scope="child" v-if="child.data")
                li: a(@click="child.data.hw.completed") #[Icon ]
                li: a(@click="del(child.data.hw.uuid)") #[Icon delete] supprimer
</template>

<script>
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
import { mapGetters, mapActions, mapState } from 'vuex'
import {
  formatDistance,
  format,
  getUnixTime,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isTomorrow,
  fromUnixTime,
  differenceInDays,
  isToday,
  isValid
} from 'date-fns'
import { fr } from 'date-fns/locale'
import CardHomework from '~/components/CardHomework.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import ModalAddHomework from '~/components/ModalAddHomework.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import InputSetting from '~/components/InputSetting.vue'
import Icon from '~/components/Icon.vue'

export default {
  components: {
    CardHomework,
    ScreenEmpty,
    ModalAddHomework,
    ButtonNormal,
    VueContext,
    HeadingSub,
    Icon,
    InputSetting
  },
  head: {
    title: 'Devoirs'
  },
  data() {
    const defaults = {
      details: null,
      due: null,
      name: null,
      subject: null,
      type: 'EXERCISE'
    }
    return {
      homework: {
        defaults,
        adding: defaults,
        editing: {
          uuid: null
        }
      }
    }
  },
  computed: {
    ...mapGetters('homework', ['grouped']),
    ...mapState(['now']),
    showCompleted() {
      return this.getSettingValue()('show_completed_exercises')
    }
  },
  methods: {
    getUnixTime,
    isToday,
    ...mapGetters('homework', ['group', '_needToShowGroup']),
    ...mapActions('homework', ['post', 'switchCompletion', 'patch']),
    ...mapActions('homework', { del: 'delete' }),
    ...mapGetters({
      getSettingValue: 'settings/value',
      getSetting: 'settings/one'
    }),
    ...mapActions({
      toggleSetting: 'settings/toggle',
      setSetting: 'settings/setValue'
    }),
    compoundDate(date) {
      if (date === 'LATE') return 'En retard'
      date = fromUnixTime(date)
      if (isToday(date)) return "aujourd'hui"
      if (isTomorrow(date)) return 'demain'
      if (!isValid(date)) return '???'

      let str = ''
      str += format(date, this.smartDateFormat(date), { locale: fr })
      if (differenceInDays(date, this.now) < 31) {
        str +=
          ' — ' +
          formatDistance(date, this.now, { locale: fr, addSuffix: true })
      }
      return str
    },
    smartDateFormat(date) {
      if (isSameWeek(date, this.now)) return 'cccc'
      if (isSameMonth(date, this.now)) return 'cccc dd'
      if (isSameYear(date, this.now)) return 'cccc dd MMM'
      else return 'cccc dd MMM yyyy'
    },
    async markAllAsDone(homeworks) {
      for (const hw of homeworks) {
        if (hw.progress !== 1)
          await this.switchCompletion({ uuid: hw.uuid, value: 1 })
      }
    }
  },
  mounted() {
    this.$withLoadingScreen(
      async () => {
        await this.$store.dispatch('settings/load')
        await this.$store.dispatch('schedule/load')
        await this.$store.dispatch('homework/load')
      },
      { title: "Feuilletage de l'agenda" }
    )
  },
  watch: {
    homework() {
      console.log(this.homework.editing)
      console.log(this.homework.adding)
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  display: flex
  justify-content: center
  align-items: flex-start
  padding: 0 20px

.grades-wrapper
  display: flex
  justify-content: center
  flex-direction: column

  &, & > *
    width: 500px
    max-width: 100%

.show-completed-exercises, .new
  display: flex
  justify-content: center
  margin-bottom: 2rem

.new
  cursor: pointer
  height: 5em

  .icon
    font-size: 3em
    display: flex
    align-items: center

  background: var(--blue-offset)
  color: var(--blue)
  border-radius: var(--border-radius)

  &:hover
    background: var(--blue-offset-dark)
    color: var(--blue-dark)

ul.homework li
  margin-bottom: 1.2em

li.group, ul.homework-groups
  flex-direction: column

li.group .mark-all-as-done i
  color: var(--black)

// .container required to override the margin-left from layout:default.
.container h2
  display: flex
  align-items: center
  margin-bottom: 0.75em
  margin-top: 3em
  width: 500px
  max-width: 100%
  margin-left: 0

  .due
    margin-right: 1em

  button
    margin-left: auto

  .late, .late button
    color: var(--red)

li.group.all-done button
  opacity: 0
  pointer-events: none

@media (pointer: fine)
  li.group:not(:hover) button
    opacity: 0
    pointer-events: none

@media (pointer: coarse), (pointer: none)
  li.group:not(.all-done) button
    opacity: 1
    pointer-events: auto

h2 button:hover
  color: var(--blue)

.empty /deep/ .Checkbox
  margin-top: 0.5em
  font-size: 0.8em
  justify-content: center
</style>
