<template>
    <div class="container-app">
        <Erro :erroProps="err" v-if="err != ''"></Erro>
        <JoinRoomBtn btnProps="clique aqui para começar a assistir" v-if="!joined && !pass" @clicked="JoinRoom()"></JoinRoomBtn>
        <PickVideoYT v-if="showVideos" @ChangeVideo="choiced($event)" @cancel="showVideos = false" />
        <div class="youtube-VideoPlayer" @click="setFocus()" tabindex="1" @keydown="emitKeysEvents($event)" v-if="joined" id="video">
            <div class="wall" @click="emitPlayPause(), setFocus()" @keydown="emitKeysEvents($event)"></div>
            <playerYT class="teste" @error="showError($event)" @cued="AskForSyncronization()" @ready="ready($event)" @playing="playing($event)" :player-vars="{autoplay:0, controls: 0, }" player-width="100%" player-height="100%" :video-id="videoId"></playerYT>
            <ControlsPlayerLiveYT
            @click="setFocus()" 
            @PlayPauseVideo="emitPlayPause()"
            @mouseSegura="mouseSegura"
            @aprenderMatematica="emitAprenderMatematica($event)"
            @setVolume="setVolume"
            @keysEvents="emitKeysEvents($event)"
            @fullScreamToggle="fullScreamToggle($event)"
            @muteUnmute="muteUnmute()"
            :time="currentTime"></ControlsPlayerLiveYT>
        </div>
        <div class="youtube-VideoPlayer-mobile" v-if="mobile">
            <div class="wall" @click="emitPlayPause(), setFocus()" @keydown="emitKeysEvents($event)"></div>
            <playerYT class="teste" @error="showError($event)" @cued="AskForSyncronization()" @ready="ready($event)" @playing="playing($event)" :player-vars="{autoplay:0, controls: 0, }" player-width="100%" player-height="100%" :video-id="videoId"></playerYT>
            <ControlsPlayerLiveMobile
            @click="setFocus()" 
            @PlayPauseVideo="emitPlayPause()"
            @mouseSegura="mouseSegura"
            @aprenderMatematica="emitAprenderMatematica($event)"
            @setVolume="setVolume"
            @keysEvents="emitKeysEvents($event)"
            @fullScreamToggle="fullScreamToggle($event)"
            @muteUnmute="muteUnmute()"
            :time="currentTime"></ControlsPlayerLiveMobile>
        </div>
        <ChatVideo v-if="joined && !mobile" @clicked="showVideos = !showVideos"/>
        <ChatVideoMobile v-show="!showVideos" v-if="joined && mobile" @clicked="showVideos = !showVideos"/>
    </div>

</template>
<script>
import io from 'socket.io-client'
import {mapState, mapActions, mapMutations} from 'vuex'

export default {
    name: 'dwV',
    layout: 'defualt',
    async asyncData(context){
        let res = await context.store.dispatch('user/getRoom',context.params.roomId)
        console.log(res, 'a room')
        if (res.room) {
            return {
                roomMembers: res.room.members,
                pass: res.room.pass,
                owner: res.room.userAdm,
                roomAdm:[{userAdm: res.room.userAdm}]
            }
        }
        else {
            return {
                roomVideos: undefined,
                pass: false,
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
    beforeMount(){
        this.responsive()
    },
    mounted(){
        this.videoId = this.$youtube.getIdFromURL('https://www.youtube.com/embed/hNGrGGbFX2s')
        window.addEventListener('beforeunload', this.emitUserDisconected)
        console.log(this.$youtube, 'el uout')

        window.addEventListener('message', event => {
            this.timeUpdateSimulation(event)
        })
        
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
            members: [],
            mobile: false,
            currentTime:'00:00',
            videoId: null,
            player: undefined,
            YTjoined: false,
            ytUrl: '',

        }
    },
    watch:{
        mediaQuery(value, payload){
            console.log(value)
            this.responsive()
            

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
        },
        mediaQuery(){
            return this.$mq
        }
    },
    middleware: [],
    methods: {
        connectionServer(){
           this.socket = io.connect('https://www.amigitos-espanol-api.com.br/',{ rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling']})
           this.socket.on('sendRequestForSynchronization', data => {
            this.sendVideoUrl(data)
           })
           this.socket.on('listMembersUpdate', data => {
            this.updateMemberRoom(data)
           })
           this.socket.on('msg', data => {
               this.renderMSG(data)
           })
           this.socket.on('setVideoUrl', data => {
            this.setVideoUrl(data)
           })
           this.socket.on('synchronize', data => {
            this.setVideoStatus(data)
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
            console.log("video que estou enviando", data)
            this.changeSrc(data)
           })
           this.socket.on('userAskingForSyncronization', data => {
            this.sendCurrentTime(data.user)
           })
           this.socket.on('currentTimeRecived', data => {
            this.setCurrentTime(data)
           })
           this.socket.on('signal', data => {
            console.log("o sinal chegou até aqui")
            this.socket.emit('answeredSignal', {roomUrl: this.room})
           })
           this.socket.on('disconnect', q => {
            this.socket.emit('desconectado', q)
           })
        },
        ...mapActions({joinByPass: 'user/joinRoomByPassword'}),
        JoinRoom(){
            if (!this.joined) {
                this.joined = true
            }
        },
        updateMemberRoom(member){
            this.members = member
        },
        AskForSyncronization(){
            console.log('enviei lol pelo coiso do yt')
            this.socket.emit('requestYTsynchronization', {room: this.room, user: this.user})
        },
        responsive(){
            console.log(this.$mq)
            if (this.$mq === 'sm') {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        },
        setFocus(){
            let video = document.getElementById('video')
            video.focus()
        },
        showError(event){
            console.log('deu erro no player lol', event)
        },
        sendVideoUrl(id){ 
            if(this.members[0].id != this.user.id) return
            let Url = this.ytUrl
            Url === "" ? Url = 'https://www.youtube.com/embed/hNGrGGbFX2s' : Url
            console.log(this.ytUrl, 'estou enviando essa url')
                let dates = {
                    room: this.room, 
                    userId: id.id,
                    Url
                }
                this.socket.emit('UrlSent',dates)       
        },
        playing(event){
            console.log(event.target, 'ta vindo aq?, não')
            this.player = event.target
            this.setTimeVideo()
        },
        async setVideoUrl(data){
            console.log('esse sim é o video que to recebendo lol', data)
            let dates = {
                room: this.room,
                userId:this.user.id
            }
            if(data.userId === this.user.id && this.members[0] != this.user.id){
                this.videoId = this.$youtube.getIdFromURL(data.Url)
                return this.socket.emit('askForCurrentTime', dates)
            }
        },
        ready(event){
            this.player = event.target
            if (!this.YTjoined) {
                this.connectionServer()
                console.log(this.user.state, 'user')
                this.socket.emit('joinRoom', {user: this.user, room: this.room})
                console.log(this.YTjoined, 'me juntei boy, qq')
                this.YTjoined = true
            }
            this.AskForSyncronization()
        },
        timeUpdateSimulation(event){
                if(!event) return
                let data = JSON.parse(event.data)
                if (data.event === 'infoDelivery' && data.info && data.info.currentTime) {
                    this.setTimeVideo()
                    this.GaloFilhoDaPuta()
                }
        
        },
        sendCurrentTime(user){
            if(this.members[0].id != this.user.id) return
            let videoStats = {
                room: this.room,
                userId: user,
                videoStats:{
                    currentTime: this.player.getCurrentTime(),
                    paused: this.player.getPlayerState(),
                }
            }
            if (this.user.id != user) {
                return this.socket.emit('sentCurrentTime', videoStats)
            }
        },
        setCurrentTime(dates){
            const play = document.querySelector('.play-pause-icon')
            if (this.user.id === dates.user) {
                console.log(dates)
                if (dates.videoStats.paused === 1){
                    console.log('dei play lol')
                    this.player.playVideo()
                    this.player.seekTo(dates.videoStats.currentTime)
                    play.src = '/svg/botao_pause.svg'
                }
                    
                
                
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
            const play = document.querySelector('.play-pause-icon')
            console.log(this.player.getPlayerState(),'cadeeeeee', this.player.getVideoData())
            if (this.player.getPlayerState() === 2 || this.player.getPlayerState() === 5) {
                this.player.playVideo()
                console.log('vou dar play?', this.player)
                play.src = '/svg/botao_pause.svg'
            }
            else {
                this.player.pauseVideo()
                play.src = '/svg/botao_play_.svg'
            }
        },
        showObject(event){
            console.log(event)
        },
        choiced(video){
            console.log(video, 'esse é o video enviado')
            this.showVideos = false
            video === '' ? video = "https://www.youtube.com/embed/hNGrGGbFX2s" : video
            this.ytUrl = video
            this.socket.emit('changeVideoToAll', {video: video, room: this.room})
        },
        changeSrc(data){
            console.log('video que recebi quando entrei', data)
            this.videoId = this.$youtube.getIdFromURL(data)
            this.ytUrl = data
        },
        GaloFilhoDaPuta(){
            const barra = document.querySelector('.progress-bar')
            if(barra){
                barra.style.width = `${this.player.getCurrentTime() / this.player.getDuration() * 100}%`
            }
        },
        setTimeVideo(){
            if(this.player === undefined) return
            let tempVideo = Math.floor(this.player.getCurrentTime())
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
        emitKeysEvents($event){
            console.log(eventEmit, ' cade o coiso')
            const eventEmit = {
                code: $event.code
            }
            this.socket.emit('keysEvents', {event: eventEmit, room: this.room})

        },
        keysEvents(key){
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
            const volumeValue = parseInt(document.querySelector('.volume').value)
            this.player.setVolume(volumeValue)
            this.oldVolume = (volumeValue)
        },
        skip5Seconds(){
            this.player.seekTo(this.player.getCurrentTime() + 5)
        },
        return5Seconds(){
            this.player.seekTo(this.player.getCurrentTime() - 5)
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
            console.log($event)
            let position = ($event.offsetX / $event.target.offsetWidth) * this.player.getDuration()
            this.player.seekTo(position)
            

        },
        mouseSegura(){
            const progress = document.querySelector('.progress')
            progress.classList.add('focus')
        },
        mouseEventHandler($event){
            const progress = document.querySelector('.progress')
            if (progress.classList.contains('focus')) {
                console.log('funcão')
                let position = ($event.offsetX / $event.target.offsetWidth) * video.duration
                video.currentTime = position
                const barra = document.querySelector('.progress-bar')
                barra.style.width = `${this.player.getCurrentTime() / this.player.getDuration() * 100}%`
                
            }
        },
        fullScreamToggle() {
            let video = document.querySelector('.youtube-VideoPlayer') || document.querySelector('.video-container-mobile')
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
        overflow: auto;
    
    }
    .wall {
        background: transparent;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2;
    }
    .youtube-VideoPlayer {
        flex: 2;
        position: relative;
        display: flex;
        flex-direction: column;
        max-width: 853px;
        min-width: 400px;
        height: 480px;
        outline: none;
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
    .youtube-VideoPlayer {
        flex: 2;
        position: relative;
        display: flex;
        flex-direction: column;
        max-width: 853px;
        min-width: 400px;
        height: 480px;
        max-height: 480px;
    }
    .youtube-VideoPlayer .teste, #youtube-player-1{
        position: absolute !important;
        width: 100% !important;
        height: 100% !important;
    }
    @media screen and (max-width: 740px) {
        .video-container-mobile {
            flex: 2;
            width: 100%;
            min-height: 200px;
            position: relative;
            height: 97vh;
        }
        #video{
            width: 95%;
            left: 50%;
            transform: translateX(-50%)
        }
    }
    @media screen and (max-width: 560px) {
        .container-app{
            flex: 1;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
            overflow: auto;
        }
        .video-container-mobile {
            min-width: 360px;
            width: 100%;
        }
        .video-container-mobile #video {
           width: 100%;
        }
        
    }
        


</style>