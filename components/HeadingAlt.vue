<template>
    <h2 class="HeadingAlt" :class="{'has-inline-buttons': hasInlineButtons}">
        <slot></slot>
    </h2>
</template>

<script>
export default {
    name: 'HeadingAlt',


    props: {
        hasInlineButtons: {
            type: Boolean,
            default: false
        },
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
@import '~/assets/defaults'
.HeadingAlt 
    font-weight: bold
    margin-top: 20px
    +desktop
        font-size: 48px
    +mobile
        font-size: 48px

.HeadingAlt.has-inline-buttons 
    display: flex
    align-items: center

+desktop
    .HeadingAlt
        white-space: nowrap
        max-width: 50vw

</style>