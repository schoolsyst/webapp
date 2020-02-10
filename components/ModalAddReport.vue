<template lang="pug">
  ModalObject(
    v-bind="{...description, action, validation}"
    @submit="$emit('submit')"
    @delete="$emit('delete')"
    add-button-text="Envoyer"
    :modal-title="modalTitle"
    :delete-button-text="null"
  )
    template(v-if="canSubmit")
      .report-type
        InputButtonsSelect(
          :values="reportTypes"
          :value="value.type"
          @input="$emit('input', { ...value, type: $event })"
        )
      .report-title
        InputField(
          type="text"
          name="title"
          :value="value.title"
          @input="$emit('input', { ...value, title: $event })"
        ) Titre
      .report-message
        template(v-if="value.type === 'BUG'")
          InputField(
            type="block"
            name="what"
            :value="message.what",
            @input="handleMessageInput('what', $event)"
            placeholder="Décrivez le comportement du bug et comment vous l'avez rencontré"
          ) Que s'est-il passé ?
          InputField(
            type="block"
            name="expected"
            :value="message.expected",
            @input="handleMessageInput('expected', $event)"
            placeholder="Décrivez le comportement correct qui aurait dû avoir lieu si le bug n'existait pas"
          ) À quoi vous attendiez-vous ?
        template(v-else)
          InputField(
            type="block"
            name="problem"
            :value="message.problem",
            @input="handleMessageInput('problem', $event)"
            placeholder="Si votre solution ne répond pas à un problème en particulier, expliquez pourquoi elle est utile"
          ) Quel est le problème ?
          InputField(
            type="block"
            name="solution"
            :value="message.solution",
            @input="handleMessageInput('solution', $event)"
            placeholder="N'hésitez pas à rajouter des captures d'écrans et autres ressources que vous pensez utiles."
          ) Quel est votre solution ?
      p.notice
        | Votre rapport sera publié #[a(href="https://github.com/schoolsyst/frontend/issues" target="_blank") sur GitHub], où votre nom d'utilisateur
        | , navigateur, OS et type d'appareil seront visibles, afin d'aider le réglage de votre problème.
    template(v-else)
      ScreenEmpty(small @cta="$router.push('/')" @cta-secondary="goToGithub")
        template(#smiley) T_T
        h1 Revenez demain.
        p Pour éviter les abus, il est impossible de publier plus de 5 rapports par jour. Merci pour vos contributions acharnées !
        p Vous pouvez toujours créer votre demande sur github.com directement, mais il faudra vous faudra un compte GitHub.
        template(#cta) Retour à l'accueil
        template(#cta-secondary) Créer une demande sur GitHub
</template>

<script>
import { mapGetters } from 'vuex'
import ModalObject from '~/components/ModalObject.vue'
import InputField from '~/components/InputField.vue'
import InputButtonsSelect from '~/components/InputButtonsSelect.vue'

export default {
  components: { ModalObject, InputField, InputButtonsSelect },
  props: {
    value: {
      type: Object,
      required: true
    },
    action: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      description: {
        name: 'report',
        verboseName: 'rapport',
        gender: 'M'
      },
      reportTypes: [
        {
          key: 'BUG',
          label: 'Signaler un bug'
        },
        {
          key: 'FEATURE',
          label: 'Proposer une fonctionnalité'
        }
      ],
      message: {
        // Bug report
        how: '',
        what: '',
        expected: '',
        // Feature request
        problem: '',
        solution: ''
      },
      titles: {
        how: 'Comment avez-vous rencontré ce bug ?',
        what: "Que s'est-il passé ?",
        expected: 'À quoi vous attendiez-vous ?',
        problem: 'À quel problème répond votre solution ?',
        solution: 'Décrivez votre solution'
      }
    }
  },
  computed: {
    fullMessage() {
      const sections =
        this.value.type === 'BUG'
          ? ['what', 'expected']
          : ['problem', 'solution']

      console.log(`getFullMessage: sections=${sections}`)

      // let message = sections
      // console.log(`getFullMessage: message=${message}`)
      const message = sections
        .filter((s) => !!this.message[s])
        .map((s) => `<h2>${this.titles[s]}</h2>${this.message[s]}`)
        .join('')
      console.log(`getFullMessage: message=${message}`)

      return message
    },
    deviceType() {
      const { height, width } = window.screen
      if (height > width) return 'PHONE'
      if (height === width) return 'SMARTWATCH'
      if (width < 1300) return 'LAPTOP'
      if (width > 1300) return 'DESKTOP'
      else return 'OTHER'
    },
    modalTitle() {
      switch (this.value.type) {
        case 'BUG':
          return 'Signaler un bug'

        case 'FEATURE':
          return 'Proposer une fonctionnalité'

        default:
          return null
      }
    },
    canSubmit() {
      return this.$auth.user.remaining_daily_github_issues > 0
    },
    validation() {
      return this.validate()(this.value)
    }
  },
  methods: {
    ...mapGetters('reports', ['validate']),
    handleMessageInput(section, $event) {
      this.message[section] = $event
      this.$emit('input', { ...this.value, content: this.fullMessage })
    }
  }
}
</script>

<style lang="stylus" scoped>
.report-type
  display: flex
  justify-content: center
  margin-bottom: 1em

.notice
  font-size: 0.75em
  width: 500px
  text-align: center
</style>
