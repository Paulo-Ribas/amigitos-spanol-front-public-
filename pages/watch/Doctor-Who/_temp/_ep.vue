<template>
<section id="ep-doctor-who">
<div class="container">
  <div class="video-container" tabindex="1" @keydown="keysEvents($event)"> 
    <video :src="episodeLink" id="video" @timeupdate="GaloFilhoDaPuta()" @click="PlayPauseVideo()" @dblclick="fullScreamToggle($event)"></video>
    <ControlsPlayer v-if="!mobile"
        :time="currentTime"
        @PlayPauseVideo="PlayPauseVideo($event)"
        @mouseSegura="mouseSegura"
        @setVolume="setVolume"
        @aprenderMatematica="aprenderMatematica($event)"
        @keysEvents="keysEvents($event)"
        @fullScreamToggle="fullScreamToggle($event)"
        @muteUnmute="muteUnmute()"
    />
    <ControlsPlayerMobile v-if="mobile"
        :time="currentTime"
        @PlayPauseVideo="PlayPauseVideo($event)"
        @mouseSegura="mouseSegura"
        @setVolume="setVolume"
        @aprenderMatematica="aprenderMatematica($event)"
        @keysEvents="keysEvents($event)"
        @fullScreamToggle="fullScreamToggle($event)"
        @muteUnmute="muteUnmute()"
    />
  </div>
  <div class="eps-list-container" v-show="mobile">
    <SerieSeasonList :selectedTempProps="tempProps" :selectedEpProps="epProps"></SerieSeasonList>
  </div>
</div>
</section>
</template>

<script>
export default {
    async asyncData(context){
        let episodeLink = await context.app.store.dispatch('series/getEp', {temp:context.route.params.temp,ep:context.route.params.ep})
        return{
            episodeLink: episodeLink.amazonFront
        }
        
    },
    fetchOnServer: false,
    mounted(){
        this.loaded = true
        this.responsive()
    },
    head(){
        return {
            title: 'assistindo Doctor Who',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: 'description', name: 'description', content: 'um site feito em homenagem para um antigo grupo, aqui você pode assistir videos ao mesmo tempo com seus amigos, tanto pelo youtube ou você mesmo fazendo upload deles' },
                { name: 'format-detection', content: 'telephone=no'},
                {name:'robots', content: 'nofollow'},
                {name: 'author', content: 'Paulo Ribas'},
            ]
        }
    },
    data(){
        return {
            currentTime:'00:00',
            loaded: false,
            oldVolume: 1,
            mobile: false,
            temp: this.$route.params.temp,
            ep: this.$route.params.ep
        }
    },
    computed: {
        mediaQuery(){
            return this.$mq
        },
        tempProps(){
            return parseInt(this.temp)
        },
        epProps(){
            return parseInt(this.ep)
        }
    },
    watch:{
        mediaQuery(value, playload){
            return this.responsive()
        }
    },
    methods: {
        PlayPauseVideo(){
            const video = document.getElementById('video')
            console.log(video.duration, video.currentTime)
            const play = document.querySelector('.play-pause-icon')
            console.log(play)
            if (video.paused) {
                video.play()
                play.src = '/svg/botao_pause.svg'
            }
            else {
                video.pause()
                play.src = '/svg/botao_play_.svg'
            }
        },
        responsive(){
            if (this.$mq === 'sm' || this.$mq === "md") {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        },
        GaloFilhoDaPuta(){
            const video = document.getElementById('video')
            const barra = document.querySelector('.progress-bar')
            if(barra){
                barra.style.width = `${video.currentTime / video.duration * 100}%`
            }
            this.setTimeVideo()
        },
        setTimeVideo(){
            let video = document.getElementById('video')
            if(video === null) return
            let tempVideo = Math.floor(video.currentTime)
            let minutos = Math.floor(tempVideo / 60)
            let segundos = Math.floor(tempVideo % 60)
            let horas = Math.floor(minutos / 60)
            minutos >= 60 ? minutos -= minutos : minutos
            let time
            if (horas <= 0){
                time = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
            }else{
                time = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
            }
            this.currentTime = time
        },
        keysEvents(key){
            const video = document.getElementById('video')
            console.log(key)
            if (key.code === 'Space') {
                this.PlayPauseVideo()
            } 
            if (key.code === 'ArrowRight') {
                this.skip5Seconds()
                    
            }
            if (key.code === 'ArrowLeft') {
                this.return5Seconds()
            }
        },
        setVolume(){
            const video = document.getElementById('video')
            const volumeValue = parseInt(document.querySelector('.volume').value)
            video.volume = (volumeValue / 100)
            this.oldVolume = (volumeValue / 100)
        },
        skip5Seconds(){
            const video = document.getElementById('video')

            video.currentTime = video.currentTime + 5
        },
        return5Seconds(){
            const video = document.getElementById('video')

            video.currentTime = video.currentTime - 5
        },
        aprenderMatematica($event){
            const video = document.getElementById('video')
            console.log($event)
            let position = ($event.offsetX / $event.target.offsetWidth) * video.duration
            video.currentTime = position
            

        },
        mouseSegura(){
            const progress = document.querySelector('.progress')
            progress.classList.add('focus')
        },
        mouseEventHandler($event){
            const progress = document.querySelector('.progress')
            if (progress.classList.contains('focus')) {
                console.log('funcão')
                const video = document.getElementById('video')
                let position = ($event.offsetX / $event.target.offsetWidth) * video.duration
                video.currentTime = position
                const barra = document.querySelector('.progress-bar')
                barra.style.width = `${video.currentTime / video.duration * 100}%`
                
            }
        },
        fullScreamToggle() {
            let video = document.querySelector('.video-container') || document.querySelector('.video-container-mobile')
            const fullscreenIcon = document.querySelector('.fullScreem-icon')
            if (!document.fullscreenElement) {
                fullscreenIcon.src = '/svg/sair_da_tela_cheia_.svg'
                video.requestFullscreen()
            }
            else {
                fullscreenIcon.src = '/svg/tela_cheia.svg'
                document.exitFullscreen()
            }
        },
        muteUnmute(){
            const video = document.getElementById('video')
            const volumeValue = document.querySelector('.volume')
            const volumeIcon = document.querySelector('.volume-icon')
            if (video.volume > 0) {
                video.volume = 0
                volumeValue.value = 0
                volumeIcon.src = '/svg/sem_som.svg'    
            }
            else {
                console.log(this.oldVolume)
                video.volume = this.oldVolume
                volumeValue.value = this.oldVolume * 100
                volumeIcon.src = '/svg/com_som.svg'    
            }
        }
    }
}
</script>

<style scoped>
    #ep-doctor-who{
        flex: 1;
        height: 100vh;
        overflow-y: auto;
    }
    .container {
        flex: 1;
        height: 100%;

    }
    .video-container {
        height: 100%;
        width: 100%;
        position: relative;
        outline: none;
    }
    video {
        width: 100%;
        height: 100%;
        position: absolute;
        outline: none;
    }
    .eps-list-container {
        width: 100%;
        flex: 1;
        padding: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    @media screen and (max-width: 760px) {
        .container {
            height: 46%;
            min-height: 268px;
        }
    }
    
</style>