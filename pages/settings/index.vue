<template lang="pug">
    //TODO: move ul.categories > li to InputSetting, to reuse in setup
    //TODO: center-align, less width, index=portal to one page per category + subjects page + schedule page
    .container
        ModalAddSubject(
          v-model="newSubject"
          action="add"
          @submit="postSubject({ subject: newSubject })"
        )
        ModalAddSubject(
          v-model="editingSubject"
          action="edit"
          @submit="patchSubject({ modifications: editingSubject, uuid: editingSubject.uuid })"
          @delete="delSubject({ uuid: editingSubject.uuid })"
        )
        .-side-by-side
            ul.categories
                li(v-for="g in grouped")
                  .heading
                    HeadingSub {{ g[0] }}
                    ButtonNormal(
                      v-if="g[0] === 'Emploi du temps'"
                      variant="outline"
                      href="/setup/schedule/events"
                      small
                    ) Changer
                    ul.settings
                        li(v-for="setting in g[1].filter(s => s.key !== 'offdays')" :key="setting.uuid")
                            InputSetting.input(
                              v-bind="{...setting, _key: setting.key}"
                              @value-set="onValueSet(setting)"
                            )
            .subjects-wrapper
                HeadingSub Matières
                ul.subjects
                    li.new(@click="$modal.show('add-subject')")
                        Icon add
                    li(v-for="subject in subjects")
                        CardSubject(v-bind="subject" @click="modifySubject(subject)")

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HeadingSub from '~/components/HeadingSub.vue'
import CardSubject from '~/components/CardSubject.vue'
import InputSetting from '~/components/InputSetting.vue'
import Icon from '~/components/Icon.vue'
import InputField from '~/components/InputField.vue'
import ModalAddSubject from '~/components/ModalAddSubject.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
export default {
  components: {
    HeadingSub,
    InputField,
    CardSubject,
    InputSetting,
    Icon,
    ModalAddSubject,
    ButtonNormal
  },
  data() {
    const defaults = {
      name: '',
      color: '#000000',
      weight: 1
    }
    return {
      newSubject: {
        ...defaults
      },
      editingSubject: {
        ...defaults,
        uuid: null
      }
    }
  },
  methods: {
    ...mapActions('subjects', {
      postSubject: 'post',
      patchSubject: 'patch',
      delSubject: 'delete'
    }),
    modifySubject(subject) {
      this.editingSubject = subject
      this.$modal.open('edit-subject')
    },
    onValueSet(setting) {
      if (setting.key === 'theme') {
        // Reload the page to apply the theme
        this.$router.go({ path: '/settings', force: true })
      }
    }
  },
  computed: {
    ...mapGetters('settings', ['grouped', 'all']),
    ...mapGetters('subjects', { subjects: 'all', sortSubjects: 'orderBy' })
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('settings/load')
      await this.$store.dispatch('subjects/load')
    })
  }
}
</script>

<style lang="stylus" scoped>
.container
  padding 0 1.2em

ul.categories li
  display: flex
  flex-direction: column
  justify-content: center
  margin-bottom: 1.5rem

  p.description
    margin-bottom: 0.5em
    margin-top: 0.5em
    font-size: 0.9em
    text-align: center
    font-style: italic

h2
  margin-bottom: 0.5em

ul.subjects li
  margin-bottom: 1em

  &.new
    background: var(--blue-offset)
    color: var(--blue)
    border-radius: var(--border-radius)
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    max-width: 450px
    height: 100px
    cursor: pointer

    & /deep/ i
      font-size: 3rem

    &:hover
      background: var(--blue-offset-dark)
      color: var(--blue-dark)
</style>
