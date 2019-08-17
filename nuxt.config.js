
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Schoolsyst' || process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A complete, centralized school management system made for students, by a student.' || process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto+Mono'},
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined'},
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.5.7/lottie.min.js' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { 
    color: '#000',
    height: '10px'
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/reset.sass',
    '~/assets/defaults.sass',
    // Fonts
    '~/assets/fonts/Manrope/import.css',

  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    '@nuxtjs/toast'
  ],
  /*
  ** Toasts
  */
  toast: {
    position: 'bottom-right',
    duration: 5000
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
      home: '/dashboard'
    },
    strategies: {
      local: {
        endpoints: {
          login: {url: '/auth/', method: 'post', propertyName: 'token'},
          user: {url: '/users/self/', method: 'get', propertyName: ''},
          logout: {url: '/auth/logout/', method:'post'},
        },
        tokenRequired: true,
        tokenType: 'Bearer',
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
    baseURL: 'http://127.0.0.1:8000/api/'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
}
