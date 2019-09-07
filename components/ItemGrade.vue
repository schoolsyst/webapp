<template lang="pug">
div.ItemGrade
    .name-area
        SubjectDot.subject(v-bind="subject")
        label.grade-max(:for="`grade-max-${uuid}`") /
        input.grade-max(:id="`grade-max-${uuid}`" v-model="mutMaximum")
        label.grade-weight(:for="`grade-weight-${uuid}`") ×
        input.grade-weight(:id="`grade-weight-${uuid}`" v-model="mutWeight")
        h5.name {{testName}}
    ul.grades
        li(:class="{'disabled': isDisabled('goal')}")
            LabelFlat Objectif
            BigNumber(
                :writables="isEditable('goal') ? ['value'] : []"
                :value="isDisabled('goal') ? null : properGrade(mutGoal)"
                @input="mutGoal = $event"
                :unit="unit"
            )
        li(:class="{'disabled': isDisabled('expected')}")
            LabelFlat Espérée
            BigNumber(
                :writables="isEditable('expected') ? ['value'] : []"
                :value="isDisabled('expected') ? null : properGrade(mutExpected)"
                @input="mutExpected = $event"
                :unit="unit"
            )
        li(:class="{'disabled': isDisabled('actual')}")
            LabelFlat Finale
            BigNumber(
                :writables="isEditable('actual') ? ['value'] : []"
                :value="isDisabled('actual') ? null : properGrade(mutActual)"
                @input="mutActual = $event"
                :unit="unit"
            )
</template>

<script>
import { mapGetters } from 'vuex';
import debounce from 'lodash.debounce'
//---------------------------------------------------
import SubjectDot from '~/components/SubjectDot.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import BigNumber from '~/components/BigNumber.vue'
import LabelFlat from '~/components/LabelFlat.vue'
export default {
    name: 'ItemGrade',

    components: {
        BadgeSubject, BigNumber, LabelFlat, SubjectDot
    },

    props: {
        uuid: String,

        grades: Array,
        subject: Object, 
        notes: Array, 
        details: String,
        
        editableFields: {
            type: Array,
            default: () => []
        },
        disabledFields: {
            type: Array,
            default: () => []
        },
    },

    data() {
        return {
            mutWeight: this.grades[0].weight,
            mutMaximum: this.grades[0].maximum,
            mutGoal: this.grades[0].goal,
            mutExpected: this.grades[0].expected,
            mutActual: this.grades[0].actual,
        }
    },

    computed: {
        ...mapGetters({
            setting: 'setting'
        }),
        testName() {
            if (this.notes.length) {
                // concatenated list of notions
                return this.notes.map(n => n.name).join(', ')
            } else {
                // fall back to truncated "details" field
                return this.details.substring(0, 50)
            }
        },
        unit() {
            return this.mutMaximum === 100 ? '%' : `/${this.mutMaximum}`
        },
        mnml() {
            return this.setting('mnml_mode')
        }
    },

    methods: {
        isEditable(field) {
            return this.editableFields.includes(field)
        },
        isDisabled(field) {
            return this.disabledFields.includes(field)
        },
        properGrade(grade) {
            return grade * this.mutMaximum
        },
        absoluteGrade(grade) {
            return grade / this.grade.maximum
        },
        async updateGrade() {
            try {
                await this.$axios.patch(`/grades/${this.grades[0].uuid}`, {
                    weight: mutWeight,
                    maximum: mutMaximum,
                    goal: mutGoal,
                    expected: mutExpected,
                    actual: mutActual,
                })
                //TODO: change in vuex state
            } catch(error) {
                this.$toast.error(`Erreur lors de la modification: ${error}`)
            }
        }
    },

    watch: {
        mutWeight: debounce(function() {
            this.updateGrade()
        }, 1000),

        mutMaximum: debounce(function() {
            this.updateGrade()
        }, 1000),

        mutGoal: debounce(function() {
            this.updateGrade()
        }, 1000),

        mutExpected: debounce(function() {
            this.updateGrade()
        }, 1000),

        mutActual: debounce(function() {
            this.updateGrade()
        }, 1000),

    }
}
</script>

<style lang="stylus" scoped>
.grades
    display grid
    grid-template-columns repeat(3, 1fr)
    li:not(:last-child)
        margin-right 20px
    li
        display flex
        flex-direction column
        &.disabled
            pointer-events none
            opacity .25

.BigNumber
    margin-top: -5px
    & /deep/ .value
        font-size 64px
    & /deep/ .unit
        font-size 48px
.LabelFlat
    margin-top 20px
    //---------------------------------------------------
    font-size 18px
    //---------------------------------------------------
    text-transform none
    font-weight normal

.name-area
    display flex
    align-items center
    input, label
        font-size 26px
    label
        opacity 0.5
    input
        font-weight bold
    input.grade-max
        max-width 50px
    input.grade-weight
        max-width 25px

.subject
    margin-right: 15px

.name
    margin-left 10px
    //---------------------------------------------------
    max-width 33vw
    font-size 24px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    //---------------------------------------------------
    font-weight normal
</style>