export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: "Schoolsyst" || process.env.npm_package_name || "",
    titleTemplate: "%s · Schoolsyst",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "A complete, centralized school management system made for students, by a student." ||
          process.env.npm_package_description ||
          ""
      },
      { name: "apple-mobile-web-app-title", content: "Schoolsyst" },
      { name: "application-name", content: "Schoolsyst" },
      { name: "msapplication-TileColor", content: "#2d89ef" },
      { name: "theme-color", content: "#1389df" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Roboto+Mono"
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
      },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#1389fd" }
    ],
    script: [
      {
        src:
          "/lottie.min.js"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#268CCE",
    height: "2px"
  },
  /*
   ** Global CSS
   */
  css: [
    // Global
    "~/assets/reset.sass",
    "~/assets/defaults.sass",
    // Fonts
    "~/assets/fonts/FantasqueSansMono/import.css",
    "~/assets/fonts/Now/import.css",
    // Icons
    "~/assets/fonts/Material-Icons/import.css"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/vue-js-modal',
    '~plugins/loading-state'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/auth",
    "@nuxtjs/toast",
    "@nuxtjs/toast",
    "@nuxtjs/markdownit",
    ["nuxt-vue-select", {}]
  ],
  /*
   ** Markdown-it configuration
   ** See https://github.com/nuxt-community/modules/tree/master/packages/markdownit
   ** and https://github.com/markdown-it/markdown-it
   */
  markdownit: {
    injected: false,
    breaks: true,
    linkify: true,
    typographer: true,
    use: [
      "markdown-it-deflist",
      "markdown-it-sup",
      "markdown-it-footnote",
      "markdown-it-checkbox",
      [
        "markdown-it-math",
        {
          renderingOptions: {
            decimalMark: ",",
            colSep: ';',
            rowSep: ';;',
          }
        }
      ],
      "markdown-it-plot",
      "markdown-it-admonition",
      "markdown-it-abbr",
      "markdown-it-slack",
      // "markdown-it-chat-formatter"
    ]
  },
  /*
   ** Toasts
   */
  toast: {
    position: "bottom-left",
    duration: 3000,
  },
  /*
   ** Auth module configuration.
   ** See https://auth.nuxtjs.org
   */
  auth: {
    redirect: {
      login: "/login",
      logout: "/login",
      callback: false,
      home: false,
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: "/auth/", method: "post", propertyName: "token" },
          user: { url: "/users/self/", method: "get", propertyName: "" },
          logout: { url: "/auth/logout/", method: "post" }
        },
        tokenRequired: true,
        tokenType: "Bearer"
      }
    },
    // resetOnError: true,
    rewriteRedirects: false
  },
  router: {
    middleware: ["auth"]
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: "http://localhost:9999/api/"
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
      name: "Schoolsyst",
      author: "Mx3",
      description:
        "A complete, centralized school management system made for students, by a student.",
      theme_color: "#ffffff",
      lang: "fr",
      //Needed to make sure it works w/ iOS, will do testing (See: https://medium.com/@firt/dont-use-ios-web-app-meta-tag-irresponsibly-in-your-progressive-web-apps-85d70f4438cb)
      nativeUI: true
    }
  }
};
