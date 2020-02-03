<template lang="pug">
  .container
    template(v-if="$auth.user.remaining_daily_github_issues > 0 && !submitted")
      h1.header(v-if="type === 'BUG'") Signalez un bug
      h1.header(v-else) Proposez une fonctionnalité
      form(@submit.prevent="submitted = post({ report })")
        //TODO: use groupped button switch instead, and put it as the h1
        RadioButtons(name="type" v-model="type" :values="typesActions") Type de demande
        RadioButtons(name="type" v-model="device" :values="devices") Type d'appareil
        InputField(required v-model="title" name="title" :placeholder="`Un résumé de votre ${typesNouns[type]}`") Titre
        //TODO: use tiptap (make InputField[type=html])
        InputField(
          v-for="(section, i) in contentSections[type]" :key="section.label"
          v-model="contentSections[type][i].content"
          type="block"
          :placeholder="section.placeholder"
          required
        ) {{ section.label }}
        InputField(
          v-model="happened"
          type="date"
          v-if="type === 'BUG'"
        ) Quand le bug s'est-il produit ?
        ButtonNormal(type="submit" variant="primary" v-bind="{validation}") Envoyer le rapport
        p.notice
          | Votre rapport sera publié #[a(href="https://github.com/schoolsyst/frontend/issues" target="_blank") sur GitHub], où votre nom d'utilisateur
          template(v-if="type === 'BUG'") , navigateur, OS et type d'appareil seront visibles, afin d'aider le réglage de votre problème.
          template(v-else)  sera visible.
    template(v-else-if="submitted")
      ScreenSuccess(small @cta="$router.push('/')" image="thumbs-up")
        h1 Merci pour votre contribution !
        p(v-if="githubLink") Vous pouvez aller voir votre #[em issue] créée sur GitHub #[a(:href="githubLink") ici]
        template(#cta) Retour à l'accueil
        template(v-if="githubLink" #cta-secondary)
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
import { mapActions, mapGetters } from 'vuex'
import ButtonNormal from '~/components/ButtonNormal.vue'
import InputField from '~/components/InputField.vue'
import ScreenEmpty from '~/components/ScreenEmpty.vue'
import ScreenSuccess from '~/components/ScreenSuccess.vue'
import RadioButtons from '~/components/RadioButtons.vue'
export default {
  components: {
    InputField,
    RadioButtons,
    ButtonNormal,
    ScreenEmpty,
    ScreenSuccess
  },
  data() {
    return {
      submitted: false,
      type: 'BUG',
      typesActions: [
        { key: 'BUG', label: 'Signalement de bug' },
        { key: 'FEATURE', label: 'Proposition de fonctionnalité' }
      ],
      typesNouns: {
        BUG: 'bug',
        FEATURE: 'fonctionnalité'
      },
      device: 'OTHER',
      devices: [
        { key: 'DESKTOP', label: 'Ordinateur fixe' },
        { key: 'LAPTOP', label: 'Ordinateur portable' },
        { key: 'PHONE', label: 'Smartphone' },
        // { key: 'SMARTWATCH', label: 'Montre connectée' },
        { key: 'OTHER', label: 'Autre' }
      ],
      happened: new Date(),
      url: window.location.href,
      title: '',
      contentSections: {
        BUG: [
          {
            label: "Que s'est-il passé ?",
            placeholder:
              "Décrivez le comportement du bug.\nN'hésitez pas à rajouter des captures d'écrans et autres ressources que vous pensez utiles.",
            content: ''
          },
          {
            label: 'Comment avez-vous rencontré ce bug ?',
            placeholder:
              'Décrivez le contexte et les actions effectuées pour le rencontrer.\nCeci nous permettra de le reproduire',
            content: ''
          },
          {
            label: 'À quoi vous attendiez-vous ?',
            placeholder:
              "Décrivez le comportement correct qui aurait dû avoir lieu si le bug n'existait pas",
            content: ''
          }
        ],
        FEATURE: [
          {
            label: 'À quel problème répond votre solution ?',
            placeholder:
              'Si votre solution ne répond pas à un problème en particulier, expliquez pourquoi elle est utile',
            content: ''
          },
          {
            label: 'Décrivez votre solution',
            placeholder:
              "N'hésitez pas à rajouter des captures d'écrans et autres ressources que vous pensez utiles.",
            content: ''
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('reports', ['latest']),
    report() {
      return {
        type: this.type,
        happened: this.happened,
        title: this.title,
        device: this.device,
        content: this.contentSections[this.type]
          .map((o) => (o.content ? `<h2>${o.label}</h2>${o.content}` : ''))
          .join(''),
        url: window.location.href
      }
    },
    validation() {
      return this.validate()(this.report)
    },
    githubLink() {
      if (!this.submitted) return null
      const report = this.latest
      if (report && 'github_issue' in report) {
        return `https://github.com/schoolsyst/frontend/issues/${report.github_issue}/`
      } else {
        return null
      }
    }
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('reports/load')
    })
    if (this.device === 'OTHER') this.device = this.detectDeviceType()
  },
  methods: {
    ...mapActions('reports', ['post']),
    ...mapGetters('reports', ['validate']),
    detectDeviceType() {
      const { height, width } = window.screen
      if (height > width) return 'PHONE'
      if (height === width) return 'SMARTWATCH'
      if (width < 1300) return 'LAPTOP'
      if (width > 1300) return 'DESKTOP'
      else return 'OTHER'
    },
    goToGithub() {
      window.location.href =
        'https://github.com/schoolsyst/frontend/issues/new/choose'
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  max-width: 700px
  margin: 0 auto
  padding-bottom: 2em // TODO: #beta-1.0.0 put this padding on every container (will be a footer soon)

.header
  text-align: center
  margin-bottom: 2em

/deep/ textarea
  min-height: 7.5rem

form
  .button
    display: flex
    justify-content: center

  .RadioButtons
    margin-bottom: 1.5em

.notice
  text-align center
  margin-top 1em
  font-size: 0.85em
  line-height: 1.5
</style>
