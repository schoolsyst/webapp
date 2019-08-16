<template>
  <button class="ButtonLargeFlat">
    <i class="icon material-icons">add</i>
    <span class="text">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: "ButtonLargeFlat"
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.ButtonLargeFlat 
    display: flex
    align-items: center
    max-width:   calc(100vw - (18px + 20px))
    // ↑ take at most… |         |    |
    //                 |         |    |--> Compensate for margins on root container
    //                 |         |--> *One* character length (see the <.text> font-size):
    //                 |              text-overflow: ellipsis uses the single-char triple-dot ('…'), not 3 full stops ('...')
    //                 |--> The entire screen
    overflow: hidden
    +desktop
        padding: 10px 0
    +mobile
        padding: 5px 0


.icon, .text 
    color: var(--blue)

.icon 
    margin-right: 20px
    +desktop
        font-size: 64px
    +mobile
        font-size: 48px

.text 
    +desktop
        font-size: 28px
    +mobile
        font-size: 18px
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden

</style>