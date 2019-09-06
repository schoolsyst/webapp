<template lang="pug">
div.ItemGrade
    .name-area
        BadgeSubject(v-if="mnml" v-bind="subject" )
        DotSubject(v-else v-bind="subject")
        h5.name {{testName}}
    ul.grades
        li(:class="{'disabled': isDisabled('goal')}")
            LabelFlat Objectif
            BigNumber(
                :writables="isEditable('goal') ? ['value'] : []"
                :value="isDisabled('goal') ? null : properGrade(grade.goal)"
                :unit="unit"
            )
        li(:class="{'disabled': isDisabled('expected')}")
            LabelFlat Espérée
            BigNumber(
                :writables="isEditable('expected') ? ['value'] : []"
                :value="isDisabled('expected') ? null : properGrade(grade.expected)"
                :unit="unit"
            )
        li(:class="{'disabled': isDisabled('actual')}")
            LabelFlat Finale
            BigNumber(
                :writables="isEditable('actual') ? ['value'] : []"
                :value="isDisabled('actual') ? null : properGrade(grade.actual)"
                :unit="unit"
            )
</template>

<script>
import SubjectDot from '~/components/SubjectDot.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import BigNumber from '~/components/BigNumber.vue'
import LabelFlat from '~/components/LabelFlat.vue'
import { mapGetters } from 'vuex';
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
            return this.grade.maximum === 100 ? '%' : `/${this.grade.maximum}`
        },
        grade() {
            return this.grades[0]
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
            return grade * this.grade.maximum
        }
    }
}
</script>

<style lang="stylus" scoped>
.grades
    display flex
    li:not(:last-child)
        margin-right: 20px
    li
        display flex
        flex-direction column
        &.disabled
            pointer-events none
            opacity .25

        .BigNumber
            margin-top: -10px
            & /deep/ .value
                font-size: 56px
            & /deep/ .unit
                font-size: 36px
        .LabelFlat
            margin-top: 20px

.name-area
    display flex
    align-items center

.name
    max-width 33vw
    margin-left: 10px
    font-size: 24px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    font-weight normal
</style>