import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s amigitos-spanol-y-sla',
    title: 'amigitos-spanol-y-sla',
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'um site feito em homenagem para um antigo grupo, aqui você pode assistir videos ao mesmo tempo com seus amigos, tanto pelo youtube ou você mesmo fazendo upload deles' },
      { name: 'format-detection', content: 'telephone=no'},
      {name:'robots', content: 'nofollow'},
      {name: 'author', content: 'Paulo Ribas'},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  publicRuntimeConfig: {
    dev_url: process.env.DEV_URL,
    api_url: process.env.API_URL, 
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/main.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/youtube.js', ssr: true } 
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/fontawesome',

  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  ssr: true,
  target: 'server',
  modules: [
    '@nuxtjs/axios',
    ['nuxt-vuex-localstorage'],
     'cookie-universal-nuxt',
     ['nuxt-mq']
  ],
  'mq': {
    defaultBreakpoint: 'sm',
    breakpoints: {
      sm: 500,
      md: 870,
      lg: 1250,
      xl: Infinity,
    }
  },
  fontawesome: {
    component: 'fa',
    icons: {
      solid: ['faUserGroup','faHome', 'faEnvelope', 'faUser', 'faUsers', 'faChalkboard',
        'faUpload', 'faPenToSquare', 'faCheck', 'faXmark', 'faArrowRightFromBracket', 'faArrowLeft', 'faArrowRight', 'faSearch', 'faGears', 'faFilm', 'faCommentSlash', 'faHammer', 'faPersonFallingBurst', 'faScrewdriverWrench', 'faComment', 'faChessKing', 'faExclamation', 'faEllipsis', 'faScrewdriver', 'faClapperboard', 'faMasksTheater', 'faUserPlus', 'faPeopleRoof'],
      brands: ['faYoutube']
    }
  },
  axios: {
    baseURL: 'https://amigitos-espanol-api.com.br/'

  }, 

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-youtube-embed'] 
  }
}
