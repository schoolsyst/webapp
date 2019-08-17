import Vue from 'vue'
import MarkdownItVue from 'markdown-it-vue'

const MarkdownItNuxt = {
    install(Vue, options) {
        Vue.component('markdown-it-nuxt', MarkdownItVue)
    }
}

Vue.use(MarkdownItNuxt)

export default MarkdownItNuxt