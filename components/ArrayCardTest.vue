<template lang="pug">
ul.ArrayCardTest
  li(v-for="test in tests" :key="test.uuid")
    CardTest(
      v-bind="test"
      @expand="$event ? expandedCard = test.uuid : expandedCard = null"
      :expanded="expandedCard === test.uuid"
    )
</template>

<script>
import CardTest from "~/components/CardTest.vue";

export default {
  name: "ArrayCardTest",

  components: { CardTest },

  props: {
    tests: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      expandedCard: {
        uuid: null
      }
    };
  }
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'

.CardTest
	margin-bottom: 30px
</style>
