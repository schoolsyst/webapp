<template>
  <div id="page">
    <button-primary small dangerous>pgkrekg</button-primary>
    <button-secondary dangerous>fzepkfezk</button-secondary>
    <button-icon href="https://ewen.works" target="_blank"
      >bug_report</button-icon
    >
    <button-icon disabled>send</button-icon>
    <button-icon :filled="true">send</button-icon>
    <button-icon :filled="false">send</button-icon>
    <badge-subject color="#f00">Mayonnaise</badge-subject>
    <badge-subject color="#be5251" expandable>Kaguya-sama</badge-subject>
    <hr />
    <badge-subject color="#ffeeff" always-expanded>yikes!</badge-subject>
    <badge-subject color="#b00b1e" editable expandable>hehehe</badge-subject>
    <h1>Subjects</h1>
    <ul>
      <li v-for="subject in subjects" :key="subject.uuid">
        <badge-subject editable expandable :color="subject.color">{{
          subject.name
        }}</badge-subject>
      </li>
    </ul>
    <hr />
    <base-input name="feefefe" :errors="['greoijgroe', 46546]"
      >hello!</base-input
    >
    <p>
      Hey, ça va? moi, c'est
      <text-link to="https://ewen.works">Ewen Le Bihan</text-link>, lorem ipsum
      dolor sit amet! Va faire tes
      <text-link to="/homework" new-tab>devoirs</text-link>, smh my head!!!!1
    </p>
    <hr />
    <card-homework :homework="dummyHomework" />
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropOptions } from 'vue'
import { mapGetters } from 'vuex'
import ButtonPrimary from '~/components/ButtonPrimary.vue'
import ButtonIcon from '~/components/ButtonIcon.vue'
import ButtonSecondary from '~/components/ButtonSecondary.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import BaseInput from '~/components/BaseInput.vue'
import TextLink from '~/components/TextLink.vue'
import CardHomework from '~/components/CardHomework.vue'
// import '~/types/api-resources'

export default Vue.extend({
  components: {
    ButtonPrimary,
    ButtonIcon,
    ButtonSecondary,
    BadgeSubject,
    BaseInput,
    TextLink,
    CardHomework,
  },
  data() {
    const dummyHomework: ApiResourceHomework = {
      title: 'Lorem ipsum dolor sit amet',
      subject: {
        name: 'Русская',
        color: '#EEAA44',
        uuid: 'c0ffee',
        updated_at: null,
        created_at: 'trololol',
      },
      created_at: 'gjrojger',
      updated_at: null,
      details:
        'Lorem ispum dolor sit amet et atque dum est machin truc bidule,',
      type: 'exercise',
      completed_at: null,
      due_at: '2020-05-23',
      progress: 0.58,
      notes: [],
      quizzes: ['gregergerg'],
      grades: [],
      uuid: 'cgrgre0',
    }
    return { dummyHomework }
  },
  computed: {
    ...mapGetters('subjects', { subjects: 'all' }),
  },
  mounted() {
    this.$withLoadingScreen(async () => {
      await this.$store.dispatch('subjects/load')
    })
  },
})
</script>

<style lang="stylus" scoped>
ul
  font-size 1.2em
.--card-homework
  margin-top 3em
  width: 30em
</style>
