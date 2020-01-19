<template lang="pug">
  BaseModal(:name="modalName" title="Télécharger la note")
    .-side-by-side
      .left
        RadioButtons.formats(vertical name="formats" :values="advanced ? formats : notAdvancedFormats" v-model="format") Télécharger en...
        Checkbox.advanced-formats(v-model="advanced") Plus de formats...
      .right
        InputField.filename(v-model="filename") fichier (sans l'extension)
        template(v-if="format === 'pdf'")
          RadioButtons.styles(name="pdf-render-style" v-model="pdfRenderStyle" :values="pdfRenderStyles") Style
    .submit-area
      ButtonNormal.download(
        v-tooltip="`Télécharger ${filename}.${extension}`"
        variant="primary"
        @click="dlPDF(); $emit('download')"
      )
        Icon save_alt
        | Télécharger
</template>

<script>
import debounce from 'lodash.debounce'
import slugify from 'slugify'
import BaseModal from '~/components/BaseModal.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import RadioButtons from '~/components/RadioButtons.vue'
import InputSelect from '~/components/InputSelect.vue'
import Checkbox from '~/components/Checkbox.vue'
import InputField from '~/components/InputField.vue'
import Icon from '~/components/Icon.vue'

export default {
  components: {
    BaseModal,
    Icon,
    ButtonNormal,
    RadioButtons,
    InputSelect,
    Checkbox,
    InputField
  },
  props: {
    namespace: String,
    note: Object
  },
  data() {
    return {
      blobFormats: ['pdf', 'docx', 'odt'],
      // formats: ['pdf tex docx png txt odt markdown asciidoc rst epub mediawiki'.split(' '),]
      formats: [
        { key: 'pdf', label: 'PDF' },
        { key: 'odt', label: 'OpenOffice Writer' },
        { key: 'docx', label: 'Microsoft Word (.docx)' },
        { key: 'markdown', label: 'Markdown' },
        { key: 'tex', label: 'LaTeX' },
        { key: 'txt', label: 'Texte brut' },
        // { key: 'png', label: 'Image' },
        { key: 'asciidoc', label: 'AsciiDoc' },
        { key: 'mediawiki', label: 'MediaWiki' }
      ],
      advancedFormats: ['mediawiki', 'asciidoc', 'png', 'txt'],
      advanced: false,
      format: 'pdf',
      mFilename: null,
      pdfRenderStyles: ['Normal', 'LaTeX'],
      pdfRenderStyle: 'Normal'
    }
  },
  computed: {
    modalName() {
      const modalName = 'download-note'
      if (this.namespace) return this.namespace + '-' + modalName
      else return modalName
    },
    filename: {
      get() {
        return this.mFilename || slugify(this.note.name || '').toLowerCase()
      },
      set(filename) {
        this.mFilename = filename
      }
    },
    notAdvancedFormats() {
      return this.formats.filter((f) => !this.advancedFormats.includes(f.key))
    },
    extension() {
      return this.formats.find((f) => f.key === this.format).key
    }
  },
  methods: {
    dlPDF: debounce(async function() {
      // FIXME: h1 is written 2 times for pdf
      //       → remove h1 if first node and h1.text === note.name when converting to pdf
      const responseType = this.blobFormats.includes(this.format)
        ? 'blob'
        : 'text'
      let {
        data
      } = await this.$axios.get(
        `notes/convert/${this.note.uuid}/${this.format}/`,
        { responseType }
      )
      if (responseType === 'text') data = data.content
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${this.filename}.${this.extension}`)
      document.body.appendChild(link)
      link.click()
    })
  }
}
</script>

<style lang="stylus" scoped>
.formats
  margin-bottom: 1em

.advanced-formats
  margin-bottom: 2em
  display: flex
  justify-content: center

.filename
  margin-top: auto

.styles
  margin-bottom: 1em

.submit-area
  display: flex
  justify-content: flex-end
  align-items: flex-end

.right
  height: 100%
</style>
