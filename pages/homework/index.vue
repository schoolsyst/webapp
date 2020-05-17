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
                        span.due(v-else :class="{today: isToday(fromUnixTime(group.due))}")
                          span.absolute-date {{ absoluteDate(group.due) }}
                          span.relative-date(v-if="relativeDate(group.due)") {{ relativeDate(group.due) }}
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
  isSameMonth,
  isSameYear,
  isTomorrow,
  fromUnixTime,
  differenceInDays,
  isToday,
  isValid,
  addDays,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import CardHomework from '~/components/legacy/CardHomework.vue'
import ScreenEmpty from '~/components/legacy/ScreenEmpty.vue'
import ModalAddHomework from '~/components/legacy/ModalAddHomework.vue'
import ButtonNormal from '~/components/legacy/ButtonNormal.vue'
import HeadingSub from '~/components/legacy/HeadingSub.vue'
import InputSetting from '~/components/legacy/InputSetting.vue'
import Icon from '~/components/legacy/Icon.vue'

export default {
  components: {
    CardHomework,
    ScreenEmpty,
    ModalAddHomework,
    ButtonNormal,
    VueContext,
    HeadingSub,
    Icon,
    InputSetting,
  },
  head: {
    title: 'Devoirs',
  },
  data() {
    const defaults = {
      details: null,
      due: null,
      name: null,
      subject: null,
      type: 'EXERCISE',
    }
    return {
      homework: {
        defaults,
        adding: defaults,
        editing: {
          uuid: null,
        },
      },
    }
  },
  computed: {
    ...mapGetters('homework', ['grouped']),
    ...mapState(['now', 'today']),
    showCompleted() {
      return this.getSettingValue()('show_completed_exercises')
    },
  },
  methods: {
    getUnixTime,
    fromUnixTime,
    isToday,
    ...mapGetters('homework', ['group', '_needToShowGroup']),
    ...mapActions('homework', ['post', 'switchCompletion', 'patch']),
    ...mapActions('homework', { del: 'delete' }),
    ...mapGetters({
      getSettingValue: 'settings/value',
      getSetting: 'settings/one',
    }),
    ...mapActions({
      toggleSetting: 'settings/toggle',
      setSetting: 'settings/setValue',
    }),
    absoluteDate(date) {
      if (date === 'LATE') return 'En retard'
      date = fromUnixTime(date)
      if (isToday(date)) return "aujourd'hui"
      if (isTomorrow(date)) return 'demain'
      if (!isValid(date)) return '???'

      return format(date, this.smartDateFormat(date), { locale: fr })
    },
    relativeDate(date) {
      date = fromUnixTime(date)
      const diff = differenceInDays(date, this.today)
      if (diff < 31 && !isToday(date) && !isTomorrow(date) && isValid(date)) {
        date = addDays(date, 1)
        return formatDistance(date, this.today, {
          locale: fr,
          addSuffix: false,
        })
      }
    },
    smartDateFormat(date) {
      if (differenceInDays(date, this.today) <= 7) return 'cccc'
      if (isSameMonth(date, this.today)) return 'cccc dd'
      if (isSameYear(date, this.today)) return 'cccc dd MMM'
      else return 'cccc dd MMM yyyy'
    },
    async markAllAsDone(homeworks) {
      for (const hw of homeworks) {
        if (hw.progress !== 1)
          await this.switchCompletion({ uuid: hw.uuid, value: 1 })
      }
    },
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
    },
  },
}
</script>

<style lang="stylus" scoped>
.container
  display flex
  justify-content center
  align-items flex-start
  padding 0 20px

.grades-wrapper
  display flex
  flex-direction column
  justify-content center

  &, & > *
    max-width 100%
    width 500px

.show-completed-exercises, .new
  display flex
  justify-content center
  margin-bottom 2rem

.new
  height 5em
  cursor pointer

  .icon
    display flex
    align-items center
    font-size 3em

  border-radius var(--border-radius)
  background var(--blue-offset)
  color var(--blue)

  &:hover
    background var(--blue-offset-dark)
    color var(--blue-dark)

ul.homework li
  margin-bottom 1.2em

li.group, ul.homework-groups
  flex-direction column

li.group .mark-all-as-done i
  color var(--black)

//.container required to override the margin-left from layout:default.
.container h2
  display flex
  align-items center
  margin-top 3em
  margin-bottom 0.75em
  margin-left 0
  max-width 100%
  width 500px

  .due
    margin-right 1em

    .relative-date
      margin-left 1em
      color var(--grey-light)

  button
    margin-left auto

  .late, .late button
    color var(--red)

.today, .today button
  color var(--yellow)

li.group.all-done button
  opacity 0
  pointer-events none

@media (pointer: fine)
  li.group:not(:hover) button
    opacity 0
    pointer-events none

@media (pointer: coarse), (pointer: none)
  li.group:not(.all-done) button
    opacity 1
    pointer-events auto

h2 button:hover
  color var(--blue)

.empty /deep/ .Checkbox
  justify-content center
  margin-top 0.5em
  font-size 0.8em
</style>
