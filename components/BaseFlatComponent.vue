<template lang="pug">
    li.BaseFlatComponent(:class="{'large-icon': largeIcon}")
        label.icon(:class="iconStyleClass" :for="labelFor") {{icon}}
        slot
</template>

<script>
export default {
  name: "BaseFlatComponent",

  props: {
    icon: String,
    iconStyle: {
      type: String,
      default: "outlined"
    },
    labelFor: String,
    largeIcon: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {};
  },

  computed: {
    iconStyleClass() {
      return (
        "material-icons" + (this.iconStyle === "baseline" ? "" : "-outlined")
      );
    }
  },

  mounted() {
    //TODO: fill label icon on <slot>:focus
    //this.$slots.default.forEach(vnode => console.log(vnode))
  },

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.BaseFlatComponent
    display: flex
    align-items: center
    +desktop
      padding: 0 10px
      height: 36px
      font-size: 30px
    +mobile
      padding: 0 5px
      height: 24px
      font-size: 26px

    /* Switch to filled icon on hover, if it's an outlined-style icon */
    &:hover, &:focus
       .icon.material-icons-outlined
          font-family: 'Material Icons'



.icon
    margin-right: 10px
    +desktop
        font-size: 36px
    +mobile
        font-size: 36px



/* Select the elements inside <slot> */
.BaseFlatComponent label + *
    text-align: left
    white-space: nowrap
    display: inline
    &::placeholder
      opacity: 0.25
      color: #000000

+desktop
    /* Smaller font-size for elements inside <slot> when the `inline` option is `true` */
    .ArrayButtonFlat.inline .BaseFlatComponent label + *
        font-size: 24px


// Larger icon for text-less buttons
.BaseFlatComponent.large-icon .icon
    +desktop
        font-size: 84px
    +mobile
        font-size: 64px

.BaseFlatComponent:hover .icon
    cursor: pointer

</style>