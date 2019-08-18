<template lang="pug">
    button.ButtonFloating(@click="$emit('click', $event.target.element)")
        i.material-icons {{icon}}
        slot
</template>

<script>

export default {
    name: 'ButtonFloating',
    props: {
        icon: String
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

</style>