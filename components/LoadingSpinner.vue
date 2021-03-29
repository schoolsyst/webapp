<template lang="pug">
    .la-ball-clip-rotate: div
</template>

<style lang="stylus" scoped>
/*
 * Load Awesome v1.1.0 (http://github.danielcardoso.net/load-awesome/)
 * Copyright 2015 Daniel Cardoso <@DanielCardoso>
 * Licensed under MIT
 */
.la-ball-clip-rotate, .la-ball-clip-rotate > div
  position relative
  box-sizing border-box
  -webkit-box-sizing border-box
  -moz-box-sizing border-box

.la-ball-clip-rotate
  display block
  color var(--blue)
  font-size 0

.la-ball-clip-rotate.la-dark
  color #333

.la-ball-clip-rotate > div
  display inline-block
  float none
  border 0 solid currentColor
  background-color currentColor

.la-ball-clip-rotate
  width 32px
  height 32px

.la-ball-clip-rotate > div
  width 32px
  height 32px
  border-width 2px
  border-bottom-color transparent
  border-radius 100%
  background transparent
  animation ball-clip-rotate 0.75s linear infinite
  -webkit-animation ball-clip-rotate 0.75s linear infinite
  -moz-animation ball-clip-rotate 0.75s linear infinite
  -o-animation ball-clip-rotate 0.75s linear infinite

.la-ball-clip-rotate.la-sm
  width 16px
  height 16px

.la-ball-clip-rotate.la-sm > div
  width 16px
  height 16px
  border-width 1px

.la-ball-clip-rotate.la-2x
  width 64px
  height 64px

.la-ball-clip-rotate.la-2x > div
  width 64px
  height 64px
  border-width 4px

.la-ball-clip-rotate.la-3x
  width 96px
  height 96px

.la-ball-clip-rotate.la-3x > div
  width 96px
  height 96px
  border-width 6px

/*
 * Animation
 */
@keyframes ball-clip-rotate
  0%
    transform rotate(0)
    -webkit-transform rotate(0)

  50%
    transform rotate(180deg)
    -webkit-transform rotate(180deg)

  100%
    transform rotate(360deg)
    -webkit-transform rotate(360deg)

@keyframes ball-clip-rotate
  0%
    transform rotate(0)
    -moz-transform rotate(0)

  50%
    transform rotate(180deg)
    -moz-transform rotate(180deg)

  100%
    transform rotate(360deg)
    -moz-transform rotate(360deg)

@keyframes ball-clip-rotate
  0%
    transform rotate(0)
    -o-transform rotate(0)

  50%
    transform rotate(180deg)
    -o-transform rotate(180deg)

  100%
    transform rotate(360deg)
    -o-transform rotate(360deg)

@keyframes ball-clip-rotate
  0%
    transform rotate(0)
    -webkit-transform rotate(0)
    -moz-transform rotate(0)
    -o-transform rotate(0)

  50%
    transform rotate(180deg)
    -webkit-transform rotate(180deg)
    -moz-transform rotate(180deg)
    -o-transform rotate(180deg)

  100%
    transform rotate(360deg)
    -webkit-transform rotate(360deg)
    -moz-transform rotate(360deg)
    -o-transform rotate(360deg)
</style>
