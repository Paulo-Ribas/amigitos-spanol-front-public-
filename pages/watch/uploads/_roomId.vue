<template>
    <div class="container-app">
        <div class="video-container">
            <video @timeupdate="GaloFilhoDaPuta()" tabindex="1"  @click="showObject(), PlayPauseVideo()" @keydown="keysEvents"  id="video" >
                <source src="/videoplayback.mp4">
            </video>
            <ControlsPlayerLive
            @PlayPauseVideo="emitPlay($event)"
            @mouseSegura="mouseSegura"
            @setVolume="setVolume"
            @aprenderMatematica="aprenderMatematica($event)"
            @keysEvents="keysEvents($event)"
            @fullScream="fullScream($event)"
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
            room: this.$route.params.roomId
        }
    },
    components: {
        ChatVideoVue,
        ControlsPlayer
    },
    methods: {
        connectionServer(){
           this.socket = io.connect('http://localhost:3333/')
           this.socket.on('msg', data => {
            this.renderMSG(data)
           })
           this.socket.on('PlayPause', data => {
            console.log('foi dado play')
            this.PlayPauseVideo()
           })
        },
        JoinRoom(){
            this.socket.emit('joinRoom', {userName: this.userName, userImg: this.userImg, room: this.room})
        },
        addFocus(){
            const video = document.getElementById('video')
            video.classList.add('focus')
        },
        emitPlay($event){
            this.socket.emit('playPause', {event: $event, room: this.room})

        },
        PlayPauseVideo(){
            const video = document.getElementById('video')
            console.log(video.duration, video.currentTime)
            if (video.paused) {
                video.play()
            }
            else {
                video.pause()
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
        fullScream() {
            const video = document.querySelector('.video-container')
            video.requestFullscreen()
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