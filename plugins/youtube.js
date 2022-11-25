import Vue from 'vue'

import VueYouTubeEmbed, {YouTubePlayer} from 'vue-youtube-embed'

Vue.use(VueYouTubeEmbed)
Vue.component('playerYT', YouTubePlayer)
Vue.use(VueYouTubeEmbed, { global: true })