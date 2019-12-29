<template lang="pug">
li.CardNoteFile
  ModalDialogConfirm(
    @confirm="deleteNote({uuid})", 
    confirm-text="Supprimer", 
    :name="`delete-note-${uuid}`" 
    confirm-role="danger"
  ) Confirmer supprimera la note "{{name}}" #[strong pour toujours]
  //TODO: subject color overlay on hover
  nuxt-link(:to="`/notes/${uuid}`")
    BaseCard.card
      p.detail(v-html="detailDisp")
      p.content-preview {{contentPreview}}

  ButtonIcon.delete(:open-modal="`confirm-delete-note-${uuid}`" color="black") delete
  nuxt-link(:to="`/notes/${uuid}`")
    h4.title
      SubjectDot(v-bind="subject")
      span.title-text {{name}}
</template>

<script>
import BaseCard from "~/components/BaseCard.vue";
import ButtonIcon from '~/components/ButtonIcon.vue'
import ModalDialogConfirm from '~/components/ModalDialogConfirm.vue'
import moment from "moment";
import { mapActions } from 'vuex';

export default {
	name: "CardNoteFile",

	components: {BaseCard, ButtonIcon, ModalDialogConfirm},

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

	methods: {
		...mapActions({ deleteNote: 'notes/delete' })
	}
};
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.CardNoteFile 
	position: relative
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
	// align-items: center
	// justify-content: center

.title-text
	white-space: wrap
	flex-wrap: wrap
	text-overflow: ellipsis
	word-break: break-word

.SubjectDot /deep/
	height: 100%
	width: 5px 
	margin-right: 5px
	// border-radius: 0

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

.delete
	position: absolute
	bottom: 50px
	right: 10px
	//---------------------------------------------------
	/deep/ .icon
		font-size: 30px
	//---------------------------------------------------
	display: none

//REACTIONS
//---------------------------------------------------
.CardNoteFile:hover .delete
	display: block
</style>
