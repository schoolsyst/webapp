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
    HeadingSub 1. Infos importantes
    p
      | Tout d'abord, des dates. Elles sont utiles pour calculer les 
      | moyennes du trimestre actuel et savoir quand il n'y a pas cours
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
        label(for="field_yearEnd") Fin de l'année scolaire
        input#field_yearEnd(type="date", required, v-model="yearEnd", name="yearEnd")

      .field.left-and-right
        .left
          label(for="field_offdays") Jours de congés
        .right
          textarea#field_offdays(required, v-model="offdays", name="offdays")

    p
      | Ensuite, il faut définir deux petits réglages par défaut pour les notes
      | La note maximale est particulièrement importante, elle détermine ce qui est
      | utilisé pour montrer la moyenne. En France—bien sûr—ce sera souvent 20.
      .fields
        .field
          label(for="field_gradeMax") Note maximale par défaut
          input#field_gradeMax(type="number", required, v-model="gradeMax", name="gradeMax")

        .field
          label(for="field_gradeWeight") Coefficient par défaut
          input#field_gradeWeight(type="number", required, v-model="gradeWeight", name="gradeWeight", min="1")

    
    HeadingSub 2. Vos matières
    p
      | Mettez toutes vos matières qui sont présentes dans votre emploi du temps.
      | Elles sont essentielles au fonctionnement du logiciel: à peu près toutes les
      | données sont liées de près ou de loin à une matière
    
    HeadingSub 3. Votre emploi du temps

    ArrayButtonReg
      ButtonRegSecondary(icon="power_off" @click="$auth.logout()") Annuler
      ButtonRegPrimary(icon="check" @click="finishSetup") Valider
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TheHeading from '~/components/TheHeading.vue'
import MainGroup from '~/components/MainGroup.vue'
import MainGroupLeft from '~/components/MainGroupLeft.vue'
import MainGroupRight from '~/components/MainGroupRight.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import ArrayButtonReg from '~/components/ArrayButtonReg.vue'
import ButtonRegPrimary from '~/components/ButtonRegPrimary.vue'
import ButtonRegSecondary from '~/components/ButtonRegSecondary.vue'

export default {
    middleware: ['auth'],
    layout: 'bare',
    components: {
        TheHeading,
        MainGroup,
        MainGroupLeft,
        MainGroupRight,
        HeadingSub,
        ArrayButtonReg,
        ButtonRegPrimary,
        ButtonRegSecondary,
    },

    data() {
        return {
          startOnQ1: true,
          offdays: '',
          trimester2start: '',
          trimester3start: '',
          yearStart: '',
          yearEnd: '',
          gradeMax: 20,
          gradeWeight: 1,
          hours: ''
        }
    },

    computed: {
      ...mapGetters({
        setting: 'settings/setting',
      })
    },

    methods: {
      finishSetup() {
        console.log('lololololprgjojzogo')
      }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.HeadingSub
  margin-bottom: 10px
  color: var(--blue)

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
    height: 100%
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
      height: 200px
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
    margin-bottom: 20px

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


input, textarea
    font-size: 20px
    padding: 1px 20px
    background: var(--offset-blue)
    border-radius: 10px
    color: var(--blue)
    &::placeholder
      color: var(--blue)
      opacity: 0.25
p
  line-height: 1.3
  opacity: 0.5

textarea
  height: 200px
  padding-top: 20px

input[type="date"]
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-year-field
  text-transform: uppercase

</style>
