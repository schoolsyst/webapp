<template>
    <BaseFlatComponent class="DropdownFlat" :icon="icon" :icon-style="iconStyle">
        <select
            class="input" 
            type="text" 
            :name="name" 
            :id="'input_' + name" 
            :value="value"
            :placeholder="placeholder"
            @input="$emit('input', $event.taget.value)"
        >
            <option 
                v-for="opt in options" 
                :key="opt.value" 
                :value="opt.value"
            >{{ opt.name }}
            </option>
        </select>
        <i class="material-icons dropdown-arrow" @click="openDropdown">keyboard_arrow_down</i>
    </BaseFlatComponent>
</template>

<script>
import BaseFlatComponent from '~/components/BaseFlatComponent.vue'

export default {
    name: 'DropdownFlat',

    components: {
        BaseFlatComponent
    },

    props: {
        icon: String,
        iconStyle: {
            type: String,
            default: 'outlined'
        },
        name: String,
        value: String,
        placeholder: String,
        options: {
            type: Array,
            default: []
        }
    },


    data() {
        return {
            
        }
    },

    computed: {
        
    },


    created() {

    },


    methods: {
        openDropdown() {
            this.$el.querySelector('option').click()
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.input 
    width: max-content
    letter-spacing: initial

.input:focus 
    outline: none

.input:focus ~ .icon 
    color: var(--blue)

.dropdown-arrow 
    font-size: 1.2em
</style>