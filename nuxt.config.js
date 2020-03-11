const metaInfo = {
  description:
    'Gérez vos notes, prises de cours, devoirs et autres en un seul endroit. Une application web faite par un étudiant, pour les étudiants.',
  title: "schoolsyst: une nouvelle façon d'étudier",
  url: 'https://www.schoolsyst.com', // We link to the presentation website for SEO tags, better for discovery.
  imagePath: '/assets/schoolsyst-social-preview-card.png' // Hosted on the presentation website
}

const getSocialCardPreviewTags = (data) => {
  const tags = []
  // Prepend the url to the image
  data.image = data.url + data.imagePath
  // Meta tags common to og & twitter
  const namespaces = ['og', 'twitter']
  const properties = ['title', 'url', 'image', 'description']

  namespaces.forEach((namespace) => {
    properties.forEach((prop) => {
      tags.push({
        name: `${namespace}:${prop}`,
        content: data[prop]
      })
    })
  })
  // The type
  tags.push({ name: 'og:type', content: 'website' })
  tags.push({ name: 'twitter:card', content: 'summary_large_image' })
  return tags
}

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'schoolsyst',
    titleTemplate: (titleChunk) => {
      return !titleChunk || titleChunk === 'schoolsyst'
        ? 'schoolsyst'
        : titleChunk + ' · schoolsyst'
    },
    meta: [
      ...getSocialCardPreviewTags(metaInfo),
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'A complete, centralized school management system made for students, by a student.' ||
          process.env.npm_package_description ||
          ''
      },
      { name: 'apple-mobile-web-app-title', content: 'Schoolsyst' },
      { name: 'application-name', content: 'Schoolsyst' },
      { name: 'msapplication-TileColor', content: '#2d89ef' },
      { name: 'theme-color', content: '#1389df' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#1389fd' }
    ],
    script: [
      {
        src: '/lottie.min.js'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'var(--blue)',
    height: '2px'
  },
  /*
   ** Global CSS
   */
  css: [
    // Global
    '~/assets/reset.sass',
    '~/assets/defaults.sass',
    // Fonts
    '~/assets/fonts/FantasqueSansMono/import.css',
    '~/assets/fonts/Now/import.css',
    '~/assets/fonts/RobotoMono/import.css',
    // Icons
    '~/assets/fonts/Material-Icons/import.css',
    // Plugins
    '~/plugins/v-tooltip.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/vue-js-modal',
    '~plugins/loading-screen',
    '~plugins/vue-chartkick',
    '~plugins/v-tooltip.js',
    '~plugins/vue2-touch-events',
    { src: '~plugins/ga.js', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
    // // Doc: https://github.com/nuxt-community/stylelint-module
    // '@nuxtjs/stylelint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
    ['nuxt-vue-select', {}]
  ],
  /*
   ** Toasts
   */
  toast: {
    position: 'bottom-left',
    duration: 3000
  },
  /*
   ** Auth module configuration.
   ** See https://auth.nuxtjs.org
   */
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: false,
      home: false
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/', method: 'post', propertyName: 'token' },
          user: { url: '/users/self/', method: 'get', propertyName: '' },
          logout: { url: '/auth/logout/', method: 'post' }
        },
        tokenRequired: true,
        tokenType: 'Bearer'
      }
    },
    // resetOnError: true,
    rewriteRedirects: false
  },
  router: {
    middleware: ['auth']
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:9999/api'
        : 'https://api.schoolsyst.com/api'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  pwa: {
    meta: {
      name: 'Schoolsyst',
      author: 'Mx3',
      description:
        'A complete, centralized school management system made for students, by a student.',
      theme_color: '#ffffff',
      lang: 'fr',
      // Needed to make sure it works w/ iOS, will do testing (See: https://medium.com/@firt/dont-use-ios-web-app-meta-tag-irresponsibly-in-your-progressive-web-apps-85d70f4438cb)
      nativeUI: true
    }
  }
}
