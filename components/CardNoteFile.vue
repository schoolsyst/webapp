<template>
    <li class="CardNoteFile">
        <nuxt-link :to="`notes/${filepath}`">
            <BaseCard class="card">
                <p class="detail">{{detail}}</p>
            </BaseCard>
            <h4 class="title">{{title}}</h4>
        </nuxt-link>
    </li>
</template>

<script>
import BaseCard from '~/components/BaseCard.vue'

export default {
    name: 'CardNoteFile',

    components: {
        BaseCard
    },

    props: {
        detail: String,
        title: String,
        filepath: {
            type: String,
            required: true
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
@import '~/assets/defaults'
.CardNoteFile 
    height: 300px
    width: 200px

.card 
    background: var(--grey)
    height: 250px
    width: 100%
    margin-bottom: 10px

.title 
    text-align: center
    font-weight: 500
    font-size: 18px
    line-height: 1.2em

.detail 
    font-size: 18px
    opacity: 0.5
    text-align: center
    font-weight: bold

</style>