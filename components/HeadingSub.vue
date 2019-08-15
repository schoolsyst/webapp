<template>
    <h2 class="HeadingSub" :class="{'has-inline-buttons': hasInlineButtons}">
        <slot></slot>
    </h2>
</template>

<script>
export default {
    name: 'HeadingSub',


    props: {
        hasInlineButtons: {
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
.HeadingSub 
    text-transform: uppercase
    font-weight: bold
    letter-spacing: 0.09em
    margin-top: 60px

.HeadingSub.has-inline-buttons 
    display: inline-flex
    align-items: center

</style>