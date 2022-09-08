<template>
    <div class="container-app">
        <Erro :erroProps="err" v-if="err != ''"></Erro>
        <JoinRoomBtn btnProps="clique aqui para começar a assistir" v-if="!joined && !pass" @clicked="JoinRoom()"></JoinRoomBtn>
        <JoinRoomForm labelPassProps="Digite A Senha" inputPlaceholderProps="senha..." inputSubmitProps="Pronto"
            v-if="!joined && pass" @submitEmited="roomPassVerify($event)"
        />
        <PickVideo :videosProps="filesVideos" v-if="showVideos" @ChangeVideo="choiced($event)" @cancel="showVideos = false" />
        <div class="video-container" v-if="joined">
            <video @timeupdate="GaloFilhoDaPuta()" tabindex="1" @dblclick="fullScreamToggle()" 
            @click="showObject(), emitPlayPause()" @keydown="emitKeysEvents($event)" id="video">
                <source src="/videoplayback.mp4" type="video/mp4">
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
        <ChatVideo  v-if="joined" @clicked="showVideos = !showVideos"/>
    </div>

</template>
<script>
import io from 'socket.io-client'
import {mapState, mapActions, mapMutations} from 'vuex'
import ButtonSpecial from '../../../components/ButtonSpecial.vue'

export default {
  components: { ButtonSpecial },
    name: 'dwV',
    layout: 'defualt',
    async asyncData(context){
        let res = await context.store.dispatch('user/getRoom',context.params.roomId)
        console.log(res, 'a room')
        if (res.room) {
            return {
                roomVideos: res.room.filesVideos,
                roomMembers: res.room.members,
                pass: res.room.pass,
                roomAdm:[{userAdm: res.room.userAdm}]
            }
        }
        else {
            return {
                roomVideos: undefined,
            }
        }
    },
    fetch(){
        console.log('videos', this.filesVideos)
         this.$store.dispatch('user/validateUser', this.$cookies.get('token')).then(res => {
            this.$store.commit('user/SET_USER_INFO', res)
            console.log('agr virou promise com then', res)
         }).catch(err => {
            console.log('console do erro por virar primisse com then', err)
         })
    },
    fetchOnServer: false,
    mounted(){
        window.addEventListener('beforeunload', this.emitUserDisconected)
    },
    beforeDestroy(){
        this.emitUserDisconected()
    },
    data(){
        return {
            joined: false,
            socket: null,
            room: this.$route.params.roomId,
            oldVolume: 1,
            showVideos: false,
            connected: false,
            err: '',
        }
    },
    computed:{
        ...mapState({user: state => state.user}),
        filesVideos(){
            if (this.roomVideos) {
                return this.roomVideos
                
            }
            else {
                return []
            }
        }
    },
    middleware: ['auth', 'roomPass'],
    methods: {
        connectionServer(){
           this.socket = io.connect('http://localhost:3333/',{ rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling']})
           this.socket.on('synchronizeRequest', data => {
            let source = document.querySelector('source')
            let video = document.getElementById('video')
            let newData = {
                url: source.src,
                paused: video.paused,
                currentTime: video.currentTime,
                room: data.room,
                userId: data.userId
            }
            this.socket.emit('synchronize', newData)
           })
           this.socket.on('sendRequestForSynchronize', data => {
            this.sendRequestForSynchronize()
           })
           this.socket.on('synchronize', data => {
            this.setVideoStatus(data)
           })
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
           this.socket.on('changeVideo', data => {
            this.changeSrc(data)
           })
           this.socket.on('disconnect', q => {
            this.socket.emit('desconectado', q)
           })
        },
        ...mapActions({joinByPass: 'user/joinRoomByPassword'}),
        JoinRoom(){
            this.connectionServer()
            console.log(this.user.state, 'user')
            this.socket.emit('joinRoom', {user: this.user, room: this.room})
            this.joined = true
        },
        sendRequestForSynchronize(){
            console.log('oléo')
            if (this.roomMembers.length >= 1) {
                let dates = {
                    room: this.room, 
                    userId: this.user.id,
                }
                this.socket.emit('askForSynchronize',dates)
            }          
        },
        setVideoStatus(data){
            let source = document.querySelector('source')
            let video = document.getElementById('video')
            console.log('foi aqui?', data.userId, this.user.id)
            if(data.userId === this.user.id){
                source.setAttribute('src', data.url)
                video.load()
                data.paused ? video.pause() : video.play()
                video.currentTime = data.currentTime
            }
        },
        roomPassVerify(event){
            this.joinByPass({password: event.password,roomUrl: this.room, token: this.$cookies.get('token')}).then(correct => {
                console.log('correto?', correct)
                if(correct.correct === true) {
                    this.JoinRoom()
                    this.err = ''
                }
            }).catch(err => {
                console.log(err)
                this.err = err.response.data.err
            })

        },
        disconnectRoom(user){
            this.joined = false
            if(this.socket){
                this.PlayPauseVideo()
                this.socket.emit('desconectado', {user: user})
                this.socket.disconnect(true)
            }
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
        showObject(event){
            console.log(event)
        },
        choiced(video){
            console.log(video, 'esse é o video enviado')
            this.showVideos = false
            this.socket.emit('changeVideoToAll', {video: video, room: this.room})
        },
        changeSrc(src){
            let video = document.querySelector('video')
            document.querySelector('source').src = src.location
            video.load()
        },
        GaloFilhoDaPuta(){
            const video = document.getElementById('video')
            const barra = document.querySelector('.progress-bar')
            if(barra){
                barra.style.width = `${video.currentTime / video.duration * 100}%`
            }
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
        },
        emitUserDisconected(){
            if (this.socket) {
                this.socket.emit('desconectado', {user: this.user, room: this.room})
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