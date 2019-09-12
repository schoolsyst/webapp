<template lang="pug">
div.ItemGrade
    ModalDialogConfirm(:name="`delete-grade-${uuid}`" @confirm="deleteGrade" confirm-role="danger")
        | Confirmer supprimera cette note pour toujours (mais pas le contrôle associé)

    .name-area
        SubjectDot.subject(v-bind="subject")
        h5.name {{testName}}
        .grade-max-field 
            label.grade-max(:for="`grade-max-${uuid}`") /
            input.grade-max(:id="`grade-max-${uuid}`" v-model="mutMaximum")
        .grade-weight-field 
            label.grade-weight(:for="`grade-weight-${uuid}`") ×
            input.grade-weight(:id="`grade-weight-${uuid}`" v-model="mutWeight")
        ButtonIcon.delete(:open-modal="`confirm-delete-grade-${uuid}`" open-at="center" color="black") delete
    ul.grades
        li(:class="{'disabled': isDisabled('goal')}")
            LabelFlat Objectif
            BigNumber(
                :writables="isEditable('goal') ? ['value'] : []"
                :value="isDisabled('goal') ? null : properGrade(mutGoal)"
                @input="mutGoal = $event"
                :unit="unit"
            )
        //- li(:class="{'disabled': isDisabled('expected')}")
        //-     LabelFlat Espérée
        //-     BigNumber(
        //-         :writables="isEditable('expected') ? ['value'] : []"
        //-         :value="isDisabled('expected') ? null : properGrade(mutExpected)"
        //-         @input="mutExpected = $event"
        //-         :unit="unit"
        //-     )
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
import ButtonIcon from '~/components/ButtonIcon.vue'
import ModalDialogConfirm from '~/components/ModalDialogConfirm.vue'
export default {
    name: 'ItemGrade',

    components: {
        BadgeSubject, BigNumber, LabelFlat, SubjectDot, ButtonIcon, ModalDialogConfirm
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
    },

    methods: {
        isEditable(field) {
            return this.editableFields.includes(field)
        },
        isDisabled(field) {
            return this.disabledFields.includes(field)
        },
        properGrade(grade) {
            return grade === null ? null : grade * this.mutMaximum
        },
        absoluteGrade(grade) {
            return grade / this.grade.maximum
        },
        async updateGrade() {
            try {
                await this.$axios.patch(`/grades/${this.grades[0].uuid}/`, {
                    weight: this.mutWeight,
                    maximum: this.mutMaximum,
                    goal: this.absoluteGrade(this.mutGoal),
                    actual: this.absoluteGrade(this.mutActual),
                })
                //TODO: change in vuex state
            } catch(error) {
                this.$toast.error(`Erreur lors de la modification: ${error}`)
            }
        },
        async deleteGrade() {
            try {
                await this.$axios.delete(`/grades/${this.grades[0].uuid}/`)
            } catch (error) {
                this.$toast.error(`Erreur lors de la suppression de ${this.testName}: ${error}`)
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

        // mutGoal: debounce(function() {
        //     this.updateGrade()
        // }, 1000),

        mutGoal() {
            this.updateGrade()
        },

        mutActual: debounce(function() {
            this.updateGrade()
        }, 1000),

    }
}
</script>

<style lang="stylus" scoped>
.grades
    display grid
    grid-template-columns repeat(2, 1fr)
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
    // max-width 33vw
    display grid
    grid-template-columns 50px 1fr 50px 25px 25px
    grid-gap 10px
    & > *
        display flex
        align-items center
    input, label
        font-size 26px
    label
        opacity 0.5
    input
        font-weight bold

.name
    font-size 24px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    //---------------------------------------------------
    font-weight normal

.delete /deep/ .icon
    font-size: 28px
</style>