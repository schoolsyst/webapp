<template lang="pug">
//-
  COMPONENT TREE
  Excluding single-use components (TheHeading, TheNavbar, TheFooter,...)

  ArrayButtonFlat
  MainGroup
    MainGroupLeft
    MainGroupRight

.container
  TheHeading Configuration initiale
  MainGroup(full-size)
    form(@submit.prevent="finishSetup" method="post")
      HeadingSub 1. Infos importantes
      p
        | Tout d'abord, des dates. Elles sont utiles pour calculer les 
        | moyennes du trimestre actuel et savoir quand il n'y a pas cours.
        br
        | "Début" réfère au premier jour inclus. ex: si votre année commence le 09/03, rentrez ce jour-ci.
      .fields
        .field
          label(for="field_yearStart") Début de l'année scolaire
          input#field_yearStart(type="date", required, v-model="yearStart", name="yearStart")

        .field
          label(for="field_trimester2start") Début du 2#[sup e]&nbsp;trimestre
          input#field_trimester2start(type="date", required, v-model="trimester2start", name="trimester2start")

        .field
          label(for="field_trimester3start") Début du 3#[sup e]&nbsp;trimestre
          input#field_trimester3start(type="date", required, v-model="trimester3start", name="trimester3start")

        .field
          label(for="field_yearEnd") Début des vacances d'été
          input#field_yearEnd(type="date", required, v-model="yearEnd", name="yearEnd")

        .field.left-and-right
          .left
            label(for="field_offdays") Jours de congés
            p
              | Une date/période par ligne.
              br
              | Indiquez des périodes (inclusives) en mettant 
              br
              | "date de début - date de fin" (veillez à bien mettre un espace autour du tiret)
              br
              | La valeur par défaut correspond aux vacances trouvables sur un carnet de correspondance de d'Alzon Nîmes
              | (donc les vacances Françaises standard)
          .right
            textarea#field_offdays(required, v-model="offdays", name="offdays")

      p
        | Ensuite, il faut définir deux petits réglages par défaut pour les notes.
        br
        | L'unité des notes est particulièrement importante, elle détermine ce qui est
        | utilisé pour montrer la moyenne. En France—bien sûr—ce sera souvent 20.
        .fields
          .field
            label(for="field_gradeMax") Unité des notes
            input#field_gradeMax(type="number", required, v-model="gradeMax", name="gradeMax")

          .field
            label(for="field_gradeWeight") Coefficient par défaut
            input#field_gradeWeight(type="number", required, v-model="gradeWeight", name="gradeWeight", min="1")

      
      HeadingSub 2. Vos matières
      p
        | Mettez toutes vos matières qui sont présentes dans votre emploi du temps.
        | Elles sont essentielles au fonctionnement du logiciel: à peu près toutes les
        | données sont liées de près ou de loin à une matière

      ModalAddSubject(:subject="newSubject" no-edit-button)
      ArrayCardSubject
          li: ButtonLargeFlat(icon="plus", open-modal="add-subject", open-at="self.center.horizontal") Ajouter une {{ subjects.length ? 'autre' : 'matière'}}
          li(v-for="subject in subjects" :key="subject.uuid"): CardSubject(v-bind="subject")
      
      HeadingSub 3. Votre emploi du temps
      p 
        | Dur à implémenter! Pour l'instant, envoyez-moi une photo de 
        | votre emploi du temps #[a(href="mailto:ewen.lebihan7@gmail.com" title="ewen.lebihan7@gmail.com") par mail],
        | et je l'ajouterai pour vous.

      .centered-buttons
        ArrayButtonReg.finish-buttons
          ButtonRegSecondary(icon="cancel" @click="$router.push('/logout')") Annuler
          ButtonRegPrimary(icon="check" type="submit") Valider
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
import TheHeading from "~/components/TheHeading.vue"
import MainGroup from "~/components/MainGroup.vue"
import MainGroupLeft from "~/components/MainGroupLeft.vue"
import MainGroupRight from "~/components/MainGroupRight.vue"
import HeadingSub from "~/components/HeadingSub.vue"
import ArrayButtonReg from "~/components/ArrayButtonReg.vue"
import ButtonRegPrimary from "~/components/ButtonRegPrimary.vue"
import ButtonRegSecondary from "~/components/ButtonRegSecondary.vue"
import CardSubject from "~/components/CardSubject.vue"
import ModalAddSubject from "~/components/ModalAddSubject.vue"
import ButtonLargeFlat from "~/components/ButtonLargeFlat.vue"
import ArrayCardSubject from "~/components/ArrayCardSubject.vue"
import moment, { relativeTimeRounding } from "moment"

export default {
  middleware: ["auth"],
  layout: "bare",
  components: {
    TheHeading,
    MainGroup,
    MainGroupLeft,
    MainGroupRight,
    HeadingSub,
    ArrayButtonReg,
    ButtonRegPrimary,
    ButtonRegSecondary,
    ModalAddSubject,
    CardSubject,
    ButtonLargeFlat,
    ArrayCardSubject,
  },

  // fetch({app, store}) {
  //   const {data} = app.$axios.get('/settings/')
  //   store.commit('SET_SETTINGS', data)
  // },

  data() {
    return {
      startOnQ1: true,
      offdays: this.$store.getters.setting("offdays").value,
      trimester2start: this.toYMD(
        this.$store.getters.setting("trimester_2_start").value
      ),
      trimester3start: this.toYMD(
        this.$store.getters.setting("trimester_3_start").value
      ),
      yearStart: this.toYMD(this.$store.getters.setting("year_start").value),
      yearEnd: this.toYMD(this.$store.getters.setting("year_end").value),
      gradeMax: this.$store.getters.setting("grade_max").value,
      gradeWeight: this.$store.getters.setting("grade_weight").value,
      hours: "",
      newSubject: {
        color: "#fff",
        name: "",
        physical_weight: null,
        uuid: "new", //for the modzl-id prop on <PickerColor>
      },
    }
  },

  computed: {
    ...mapGetters({
      setting: "setting",
      subjects: "subjects/all",
    }),
    settingsHere() {
      return [
        {
          key: "offdays",
          value: this.offdays,
        },
        {
          key: "trimester_2_start",
          value: this.toDMY(this.trimester2start),
        },
        {
          key: "trimester_3_start",
          value: this.toDMY(this.trimester3start),
        },
        {
          key: "year_start",
          value: this.toDMY(this.yearStart),
        },
        {
          key: "year_end",
          value: this.toDMY(this.yearEnd),
        },
        {
          key: "grade_max",
          value: this.gradeMax,
        },
        {
          key: "grade_weight",
          value: this.gradeWeight,
        },
      ]
    },
  },

  methods: {
    finishSetup() {
      if (!this.subjects.length)
        this.$toast.error("Veuillez ajouter vos matières")
      else if (
        !(
          this.dt(this.yearStart).isBefore(this.dt(this.trimester2start)) &&
          this.dt(this.trimester2start).isBefore(
            this.dt(this.trimester3start)
          ) &&
          this.dt(this.trimester3start).isBefore(this.dt(this.yearEnd))
        )
      )
        this.$toast.error(`Vos dates ne sont pas dans le bon ordre`)
      else {
        let res
        try {
          this.settingsHere.forEach(async (s) => {
            // Try to `PATCH`. If we get an error, it's most likely because the
            // setting does not exist yet for this user: `POST` it
            try {
              res = await this.$axios.patch(`/settings/${s.key}/`, {
                value: s.value,
              })
            } catch (error) {
              res = await this.$axios.post(`/settings/`, {
                value: s.value,
                setting: s.key,
                user: this.$auth.user.id,
              })
            }
            this.$store.commit("SET_SETTING", res.data)
          })
          this.$router.push("/")
        } catch (error) {}
      }
    },
    toYMD(DMY) {
      return moment(DMY, "DD/MM/YYYY").format("YYYY-MM-DD")
    },
    toDMY(YMD) {
      return moment(DMY, "YYYY-MM-DD").format("DD/MM/YYYY")
    },
    dt(YMD) {
      return moment(YMD, "YYYY-MM-DD")
    },
  },
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.HeadingSub
  margin-bottom: 10px
  color: var(--blue)

.ArrayCardSubject
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column

+desktop
  .container
    margin-top: 50px
    display: flex
    align-items: center
    flex-direction: column
  p
    max-width: 50vw
    margin-bottom: 20px
  .field > *
    font-size: 22px
    width: 50%
    height: 100%
  label
    display: inline-block
    display: flex

  .right textarea
    width: 100%

  .field
    display: flex
    height: 50px
    margin-bottom: 20px
    &:not(.left-and-right)
      align-items: center
    &.left-and-right
      height: 250px
    &:not(.left-and-right) label
      align-items: center
    &.left-and-right label
      padding-top: 10px

+mobile
  .TheHeading
    text-overflow: ellipsis
    overflow: hidden
    white-space: pre-line
    font-size: 48px
    // text-align: center
    margin-top: 20px

  p
    padding-bottom: 20px
  .field
    margin-bottom: 20px
    width: 75vw
    
  .right, input
    margin-top: 5px

  .fields
    display: flex
    align-items: center
    flex-direction: column

  .field > *, textarea
    width: 100%

  .left, label
    text-align: center
    align-items: center
    display: flex

  input
    height: 40px

input, textarea
    font-size: 18px
    padding: 1px 20px
    background: var(--offset-blue)
    border-radius: 10px
    color: var(--blue)
    font-family: 'Roboto Mono', monospace
    &::placeholder
      color: var(--blue)
      opacity: 0.25
p
  line-height: 1.3
  opacity: 0.5
  font-size: 16px
  a
    text-decoration: underline

textarea
  height: 250px
  padding-top: 20px

input[type="date"]
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-year-field
  text-transform: uppercase

.finish-buttons
  width: 500px
.centered-buttons
  display: flex
  justify-content: center
  padding: 30px 0

</style>
