<template lang="pug">
button.ButtonIcon(@click="$emit('click', $event)")
    i.material-icons-outlined: slot
</template>

<script>

export default {
    name: 'ButtonIcon',
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.ButtonIcon:hover i,
.ButtonIcon:focus i
    font-family: 'Material Icons'
</style>