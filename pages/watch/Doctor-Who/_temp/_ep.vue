<template>
<section id="ep-doctor-who">
<div class="ep-container">
  <div class="video-container" tabindex="1" @keydown="keysEvents($event)"> 
    <video :src="episodeLink" id="video" @timeupdate="setTimeVideo(), setProgressBarByTimeVideo()" @click="PlayPauseVideo(true)" @dblclick="fullScreamToggle($event)" @loadeddata="setDuration()" @loadedmetadata="setDuration()"></video>
    <ControlsPlayer v-if="!mobile"
        :time="currentTime"
        :durationProps="duration"
        @PlayPauseVideo="PlayPauseVideo()"
        @mouseSegura="mouseSegura"
        @setVolume="setVolume($event)"
        @aprenderMatematica="aprenderMatematica($event)"
        @keysEvents="keysEvents($event)"
        @fullScreamToggle="fullScreamToggle($event)"
        @muteUnmute="muteUnmute()"
        @setProgressBarWidth="setProgressBarWidth($event)"
    />
    <ControlsPlayerMobile v-if="mobile"
        :time="currentTime"
        :durationProps="duration"
        @PlayPauseVideo="PlayPauseVideo()"
        @mouseSegura="mouseSegura"
        @setVolume="setVolume($event)"
        @aprenderMatematica="aprenderMatematica($event)"
        @keysEvents="keysEvents($event)"
        @fullScreamToggle="fullScreamToggle($event)"
        @muteUnmute="muteUnmute()"
        @setProgressBarWidth="setProgressBarWidth($event)"
    />
</div>
</div>
<div class="eps-list-container" @click.stop="" v-show="mobile">
  <SerieSeasonList :selectedTempProps="tempProps" :selectedEpProps="epProps"></SerieSeasonList>
</div>
</section>
</template>

<script>
export default {
    async asyncData(context){
        let special = context.route.query.s
        let episodeLink = await context.app.store.dispatch('series/getEp', {temp:context.route.params.temp,ep:context.route.params.ep, special})
        return{
            episodeLink: episodeLink.Url
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
            ep: this.$route.params.ep,
            duration: '00:00'
        }
    },
    watch:{
        duration(value, payload) {
            console.log(value, 'está vindo aqui?')
            let NaNSplit = value.split('N')
            if (NaNSplit.length > 1) this.duration = '00:00'

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
        PlayPauseVideo(clickedByContainer){
            const video = document.getElementById('video')
            const play = document.querySelector('.play-pause-icon')
            if(this.mobile && clickedByContainer) return
             
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
        setProgressBarByTimeVideo(){
            const video = document.getElementById('video')
            const barra = document.querySelector('.progress-bar')
            if(barra){
                barra.style.width = `${video.currentTime / video.duration * 100}%`
            }
        },
        setDuration() {
            let video = document.getElementById('video')
            let tempVideo = Math.floor(video.duration)
            let horas = Math.floor(tempVideo / 3600)
            let minutos = Math.floor((tempVideo % 3600) / 60)
            let segundos = Math.floor(tempVideo % 60)
            let time = '00:00'
            if (horas > 0) {
                time = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
            }
            else {
                time = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
            }
            this.duration = time
            console.log(this.duration)
        },
        setTimeVideo() {
            let video = document.getElementById('video')
            if (video === null) return
            let tempVideo = Math.floor(video.currentTime)
            let horas = Math.floor(tempVideo / 3600)
            let minutos = Math.floor((tempVideo % 3600) / 60)
            let segundos = Math.floor(tempVideo % 60)
            let time = '00:00'
            if (isNaN(tempVideo)) {
                this.duration = time
                return
            }
            if (horas > 0) {
                time = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
            }
            else {
                time = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
            }
            this.currentTime = time
        },
        keysEvents(key){
            const video = document.getElementById('video')
             
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
        setVolume(volume){
            const video = document.getElementById('video')
            video.volume = volume
            this.oldVolume = volume
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
            if($event.touches) {
                console.log($event)
                let position = ($event.touches[0].clientX / $event.touches[0].target.offsetWidth) * video.duration
                video.currentTime = position
                return
            } 
            let position = ($event.offsetX / $event.target.offsetWidth) * video.duration
            video.currentTime = position
            

        },
        setProgressBarWidth($event){
            const barra = document.querySelector('.progress-bar-drag')
            let clientX = $event.offsetX || $event.touches[0].clientX
            let barrWidth = $event.target.offsetWidth
            let result = 100 - ((barrWidth - clientX) / barrWidth ) * 100
            console.log(result)
            barra.style.width = `${result}%`

        },

        mouseSegura(){
            const progress = document.querySelector('.progress')
            progress.classList.add('focus')
        },
        mouseEventHandler($event){
            const progress = document.querySelector('.progress')
            if (progress.classList.contains('focus')) {
                 
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
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ep-container {
        flex: 1;
        width: 100%;
        max-width: 80%;

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
        outline: none;
    }
    .eps-list-container {
        width: 100%;
        height: 100%;
        flex: 1;
        padding: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    @media screen and (max-width: 760px) {
        .ep-container {
            display: flex;
            flex: 3;
            max-width: unset;
        }
        .video-container {
            height: 100%;
            flex: 3;
        }
        .eps-list-container {
            width: 100%;
            min-width: 170px;
            height: 90%;
            max-height: 340px

        }
        
    }
    
    @media screen and (max-width: 500px) {
        #ep-doctor-who {
            flex-direction: column;
        }
        .ep-container {
            display: flex;
            flex-direction: column;
            flex: 0;
            max-width: unset;
        }
        .video-container {
            height: 100%;
        }
        .eps-list-container {
            flex: 1;
            max-height: unset;
            height: 100%;
        }
    }
   

    
</style>