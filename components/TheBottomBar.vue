<template lang="pug">
  #bottom-bar: slot
</template>

<style lang="stylus" scoped>
#bottom-bar
  padding: 1.5em 2em
  position: fixed
  flex-wrap: wrap
  background: var(--white)
  z-index: 100
  bottom: 0
  right: 0
  left: 0
  display: flex
  align-items: center
  border-top: 1px solid var(--grey)

  .to-right
    margin-left: auto

  @media (max-width: 650px)
    font-size: 0.85em
</style>
