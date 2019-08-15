<template>
    <BaseFlatComponent class="InputFlat" :icon="icon" :icon-style="iconStyle">
        <input
            class="input" 
            type="text" 
            :name="name" 
            :id="'input_' + name" 
            :value="value"
            :placeholder="placeholder"
            @input="$emit('input', $event.taget.value)"
        >
    </BaseFlatComponent>
</template>

<script>
import BaseFlatComponent from '~/components/BaseFlatComponent.vue'

export default {
    name: 'InputFlat',

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
        placeholder: String
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
.input 
    width: max-content

.input:focus 
    outline: none

</style>