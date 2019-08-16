<template>
    <div class="BadgeSubject" :style="{backgroundColor: color}">
        <span class="subject-abbr">{{abbreviation.toUpperCase()}}</span>
    </div>
</template>

<script>
export default {
    name: 'BadgeSubject',


    props: {
        color: {
            // hex color format
            validator: function(value) { return value.match(/#(([A-Za-z0-9]{3}){1,2})/) }
        },
        abbreviation: {
            // 3-letters string
            validator: function(value) { return String(value).length === 3 }
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

</style>