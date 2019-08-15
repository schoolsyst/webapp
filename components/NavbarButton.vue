<template>
    <nuxt-link 
        class="NavbarButton" 
        :to="to" 
        :class="{'current-page': isCurrentPage(), 
                 'bad-icon': icon == 'work_outline'}"
        :title="title"
    >
        <i class="material-icons-outlined">{{ icon }}</i>
    </nuxt-link>
</template>

<script>
export default {
    name: 'NavbarButton',
    props: {
        to: String,
        icon: String,
        title: String
    },

    methods: {
        isCurrentPage: function() {
            if (this.to === '/') {
                return this.to == this.$route.path
            } else {
                return this.$route.path.startsWith(this.to)
            }
        },
    },
}
</script>

<style lang="sass" scoped>
.NavbarButton 
    background-color: transparent
    height: 64px
    width: 64px
    border-radius: 50%
    margin-bottom: 20px
    display: flex
    justify-content: center
    align-items: center

.NavbarButton i 
    font-size: 40px
    user-select: none

.NavbarButton.current-page 
    background-color: var(--offset-blue)

.NavbarButton:hover i, .NavbarButton.current-page i 
    color: var(--blue)
    font-family: 'Material Icons'

</style>