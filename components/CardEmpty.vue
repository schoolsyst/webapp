<template>
    <BaseCard class="CardEmpty">
        <span class="text"><slot></slot></span>
    </BaseCard>
</template>

<script>
import BaseCard from '~/components/BaseCard.vue'

export default {
    name: 'CardEmpty',

    components: {
        BaseCard
    },

    props: {
        
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
.CardEmpty 
    padding: 50px 50px
    width: 500px
    background: var(--grey)
    display: flex
    align-items: center
    justify-content: center

.text 
    color: black
    opacity: 0.75
    font-size: 30px

</style>