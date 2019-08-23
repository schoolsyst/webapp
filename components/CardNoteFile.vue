<template lang="pug">
    <li class="CardNoteFile">
        //TODO: maybe context-menu to delete?
        //TODO: subject color overlay on hover
        <nuxt-link :to="`/notes/${uuid}`">
            <BaseCard class="card">
                <p class="detail" v-html="detailDisp"></p>
                <p class="content-preview">{{contentPreview}}</p>
            </BaseCard>
            h4.title 
                SubjectDot(v-bind="subject")
                span.title-text {{name}}
        </nuxt-link>
    </li>
</template>

<script>
import BaseCard from "~/components/BaseCard.vue";
import SubjectDot from "~/components/SubjectDot.vue";
import moment from "moment";

export default {
  name: "CardNoteFile",

  components: {
    BaseCard,
    SubjectDot
  },

  props: {
    detail: String,
    detailKey: String,
    name: String,
    content: String,
    subject: {
      type: Object,
      default: () => {
        return { slug: "???", color: "#000000" };
      }
    },
    uuid: {
      type: String,
      required: true
    }
  },

  data() {
    return {};
  },

  computed: {
    contentPreview() {
      return this.content.substring(50);
    },
    detailDisp() {
      if (this.detailKey === "subject") {
        return "";
      } else if (moment(this.detail).isValid()) {
        return moment(this.detail).format("DD/MM/YYYY HH:mm");
      } else {
        return this.detail;
      }
    }
  },

  created() {},

  methods: {}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.CardNoteFile 
    height: 320px
    width: 220px

.card
    background: var(--grey)
    height: 270px
    margin-right: 20px
    width: 100%
    margin-bottom: 10px

.title 
    text-align: left
    font-weight: 500
    font-size: 18px
    line-height: 1.2em
    display: flex
    align-items: center
    // justify-content: center

.title-text
    white-space: wrap
    flex-wrap: wrap
    text-overflow: ellipsis
    word-break: break-word

.SubjectDot
    height: 25px
    width: 25px
    margin-right: 5px

.detail 
    font-size: 16px
    opacity: 0.5
    text-align: center
    font-family: 'Roboto Mono', monospace

.content-preview
    opacity: 0.25
    margin-top: 10px
    letter-spacing: 1px
    font-size: 9px
    overflow: hidden
    line-height: 1.2
    max-height: 180px
    // overflow-wrap: anywhere
</style>