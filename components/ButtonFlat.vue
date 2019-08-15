<template>
    <BaseFlatComponent 
        class="ButtonFlat" 
        :icon="icon" 
        :icon-style="iconStyle"
        :large-icon="largeIcon"
    >
        <button class="input"><slot></slot></button>
    </BaseFlatComponent>
</template>

<script>
import BaseFlatComponent from '~/components/BaseFlatComponent.vue'

export default {
    name: 'ButtonFlat',

    components: {
        BaseFlatComponent
    },

    props: {
        icon: String,
        iconStyle: {
            type: String,
            default: 'outlined'
        },
        largeIcon:{
            type: Boolean,
            default: false
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

    }
}
</script>

<style lang="sass" scoped>
.ButtonFlat:hover, .ButtonFlat:focus 
    color: var(--blue)


.ButtonFlat:focus, .ButtonFlat:hover .ButtonFlat 
    outline-color: transparent
    color: var(--blue)


.input 
    color: inherit
    font-size: 1em



</style>