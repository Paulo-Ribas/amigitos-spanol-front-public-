<template>
    <div class="container-app">
        <div class="video-container">
            <video @timeupdate="GaloFilhoDaPuta()" tabindex="1" @dblclick="fullScreamToggle()" @click="showObject(), emitPlayPause()" @keydown="emitKeysEvents($event)" id="video" >
                <source src="/videoplayback.mp4">
            </video>
            <ControlsPlayerLive
            @PlayPauseVideo="emitPlayPause($event)"
            @mouseSegura="mouseSegura"
            @setVolume="setVolume"
            @aprenderMatematica="emitAprenderMatematica($event)"
            @keysEvents="emitKeysEvents($event)"
            @fullScreamToggle="fullScreamToggle($event)"
            @muteUnmute="muteUnmute()"
            />
        </div>
        <ChatVideoVue/>
    </div>

</template>
<script>
import ChatVideoVue from '../../../components/chatVideo.vue'
import io from 'socket.io-client'
import ControlsPlayer from "../../../components/controlsPlayerLive.vue";
import axios from "axios"
export default {
    name: 'dwV',
    layout: 'defualt',
    created(){
        this.connectionServer()
    },
     beforeMount(){
        const token = localStorage.getItem('token')
        axios.post('http://localhost:3333/validate',{},{headers:{authorization:`bearer ${token}`}})
        .then(response => {
            const id = response.data.dates.id
            this.userId = id
            axios.get("http://localhost:3333/user/" + id).then(res => {
                console.log(res)
                const {username, profileimg} = res.data.user[0]
                this.userImg = profileimg
                this.userName = username
            }).catch(err => {
                console.log(err)
            })
            this.JoinRoom()
        }).catch(err => {
            console.log(err)
        })
    },
    data(){
        return {
            socket: null,
            userName: undefined,
            userImg: undefined,
            userId: undefined,
            room: this.$route.params.roomId,
            oldVolume: 1,
        }
    },
    middleware: ['auth'],
    components: {
        ChatVideoVue,
        ControlsPlayer
    },
    methods: {
        connectionServer(){
           this.socket = io.connect('http://localhost:3333/',{ rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling']})
           this.socket.on('msg', data => {
            this.renderMSG(data)
           })
           this.socket.on('PlayPause', data => {
            console.log('foi dado play')
            this.PlayPauseVideo()
           })
           this.socket.on('keysEvents', key => {
            this.keysEvents(key)
           })
           this.socket.on('aprenderMatematica', data => {
            this.aprenderMatematica(data)
           })
        },
        JoinRoom(){
            this.socket.emit('joinRoom', {userName: this.userName, userImg: this.userImg, room: this.room})
        },
        addFocus(){
            const video = document.getElementById('video')
            video.classList.add('focus')
        },
        emitPlayPause($event){
            this.socket.emit('playPause', {event: $event, room: this.room})

        },
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
        showObject($event){
            console.log($event)
        },

        GaloFilhoDaPuta(){
            const video = document.getElementById('video')
            const barra = document.querySelector('.progress-bar')
            barra.style.width = `${video.currentTime / video.duration * 100}%`
        },
        emitKeysEvents($event){
            const eventEmit = {
                code: $event.code
            }
            console.log(eventEmit)
            this.socket.emit('keysEvents', {event: eventEmit, room: this.room})

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
        emitAprenderMatematica($event){
            const eventEmit = {
                offsetX: $event.offsetX,
                target: {
                    offsetWidth: $event.target.offsetWidth
                }
            }
            this.socket.emit('aprenderMatematica', {room: this.room, event: eventEmit})
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
            const video = document.querySelector('.video-container')
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
    .container-app {
        flex: 1;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    
    }
    .video-container {
        flex: 2;
        position: relative;
        display: flex;
        flex-direction: column;
        max-width: 853px;
        min-width: 400px;
        height: 480px;
    }
    video {
        position: absolute;
        width: 100%;
        height: 100%;
        
    }

    svg{
        width: 10%;
        height: 50px;
    }



</style>