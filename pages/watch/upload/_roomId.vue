<template>
    <div class="container-app">
        <Erro :erroProps="err" v-if="err != ''"></Erro>
        <JoinRoomBtn btnProps="clique aqui para começar a assistir" v-if="!joined && !pass" @clicked="JoinRoom()"></JoinRoomBtn>
        <JoinRoomBtn btnProps="clique aqui para começar a assistir" v-if="!joined && owner === user.id && pass" @clicked="JoinRoom()"></JoinRoomBtn>
        <JoinRoomForm labelPassProps="Digite A Senha" inputPlaceholderProps="senha..." inputSubmitProps="Pronto"
            v-if="!joined && pass && owner != user.id" @submitEmited="roomPassVerify($event)"
        />
        <PickVideo :videosProps="filesVideos" v-show="showVideos" @ChangeVideo="choiced($event)" @cancel="showVideos = false" />
        <div class="video-container" v-if="joined && !mobile">
            <video @timeupdate="GaloFilhoDaPuta()" tabindex="1" @dblclick="fullScreamToggle()" 
            @click="showObject(), emitPlayPause()" @keydown="emitKeysEvents($event)" id="video">
                <source src="/videoplayback.mp4" type="video/mp4">
            </video>
            <ControlsPlayerLive
            :time="currentTime"
            @PlayPauseVideo="emitPlayPause($event)"
            @mouseSegura="mouseSegura"
            @setVolume="setVolume"
            @aprenderMatematica="emitAprenderMatematica($event)"
            @keysEvents="emitKeysEvents($event)"
            @fullScreamToggle="fullScreamToggle($event)"
            @muteUnmute="muteUnmute()"
            />
        </div>
        <div class="video-container-mobile" v-if="joined && mobile">
            <video @timeupdate="GaloFilhoDaPuta()" tabindex="1" @dblclick="fullScreamToggle()" 
            @click="showObject(), emitPlayPause()" @keydown="emitKeysEvents($event)" id="video">
                <source src="/videoplayback.mp4" type="video/mp4">
            </video>
            <ControlsPlayerLiveMobile
            @PlayPauseVideo="emitPlayPause($event)"
            @mouseSegura="mouseSegura"
            @setVolume="setVolume"
            @aprenderMatematica="emitAprenderMatematica($event)"
            @keysEvents="emitKeysEvents($event)"
            @fullScreamToggle="fullScreamToggle($event)"
            @muteUnmute="muteUnmute()"
            />
        </div>
        <ChatVideo v-if="joined && !mobile" @clicked="showVideos = !showVideos"/>
        <ChatVideoMobile v-if="joined && mobile" @clicked="showVideos = !showVideos"/>
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
                roomVideos: res.room.filesVideos,
                roomMembers: res.room.members,
                pass: res.room.pass,
                owner: res.room.userAdm,
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
    beforeMount(){
        this.responsive()
    },
    mounted(){
        window.addEventListener('beforeunload', this.emitUserDisconected)
        setInterval(() => {
            this.askForCurrentTime()
        }, 5000);
        setInterval(() => {
            this.sendPlayerState()
        }, 4900);
    },
    beforeDestroy(){
        this.emitUserDisconected()
    },
    head(){
        return {
            title: 'assistindo pelo Uploads',
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
            joined: false,
            socket: null,
            room: this.$route.params.roomId,
            oldVolume: 1,
            showVideos: false,
            connected: false,
            err: '',
            members: [],
            mobile: false,
            currentTime:'00:00'
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
    middleware: ['auth', 'roomPass'],
    methods: {
        connectionServer(){
           this.socket = io.connect('https://amigitos-espanol-api.com.br/',{ rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling']})
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
            this.keysEvents(key.event)
           })
           this.socket.on('aprenderMatematica', data => {
            this.aprenderMatematica(data)
           })
           this.socket.on('changeVideo', data => {
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
           this.socket.on('playerStateRecived', data => {
            this.verifyVideoState(data)
           })
           this.socket.on('userAskingCurrentTime',data => {
            this.sendCurrentTimeForVerification(data)
           })
           this.socket.on('currentTimeUploadRecived',data => {
            this.setOnlyCurrentTime(data)
            })
           this.socket.on('disconnect', q => {
            this.socket.emit('desconectado', q)
           })
        },
        ...mapActions({joinByPass: 'user/joinRoomByPassword'}),
        JoinRoom(){
            if (!this.joined) {
                this.connectionServer()
                console.log(this.user.state, 'user')
                this.socket.emit('joinRoom', {user: this.user, room: this.room})
                this.joined = true
            }
        },
        updateMemberRoom(member){
            this.members = member
        },
        responsive(){
            if (this.$mq === 'sm' || this.$mq === "md") {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        },
        sendVideoUrl(id){ 
            if(this.members[0].id != this.user.id) return
            let Url = document.querySelector('source').src
                let dates = {
                    room: this.room, 
                    userId: id.id,
                    Url
                }
                this.socket.emit('UrlSent',dates)       
        },
        async setVideoUrl(data){
            let source = document.querySelector('source')
            let video = document.getElementById('video') 
            let dates = {
                room: this.room,
                userId:this.user.id
            }
            if(data.userId === this.user.id){
                source.setAttribute('src', data.Url)
                video.load()
                setTimeout(async () => {
                    try {
                        console.log('esperando o load')
                        await this.awaitLOad()
                        console.log('load acabado')
                        return this.socket.emit('askForCurrentTime', dates)
                        
                    } catch (error) {
                        this.err = 'ocorreu um erro durante a sincronização'
                    }
                }, 1000);
                    
            }
        },
        awaitLOad(){
                let video = document.getElementById('video')
                let Try = 0
                let interval = setInterval(() => {
                    Try++
                    if (video.buffered.length > 0) {
                        return new Promise((resolve, reject) => {
                            clearInterval(interval)
                            return resolve(true)
                        })
                    }
                    if (Try >= 30) {
                        clearInterval(interval)
                        return new Promise((resolve, reject)=> {
                            return reject(true)
                        })
                    }
                    console.log('testando se o interval será parado')
                }, 1000);
        },
        sendCurrentTime(user){
            if(this.members[0].id != this.user.id) return
            let video = document.getElementById('video')
            let videoStats = {
                room: this.room,
                userId: user,
                videoStats:{
                    currentTime: video.currentTime,
                    paused: video.paused,
                }
            }
            if (this.user.id != user) {
                return this.socket.emit('sentCurrentTime', videoStats)
            }
        },
        setCurrentTime(dates){
            let video = document.getElementById('video')
            if (this.user.id === dates.user) {
                video.currentTime = dates.videoStats.currentTime
                if (!dates.videoStats.paused) {
                    video.play()
                }
                
            }
        },
        askForCurrentTime(){
            if (this.user.id != this.members[0].id) {
                this.socket.emit('askingUploadCurrentTime', {userId: this.user.id, room: this.room})
            }
        },
        sendCurrentTimeForVerification(data){
            let video = document.querySelector('video')
            if (this.user.id === this.members[0].id) {
                let currentTime = video.currentTime
                this.socket.emit('currentTimeUpload', {currentTime, userId: data.userId, room: this.room})
                
            }
        },
        setOnlyCurrentTime(data){
            let video = document.querySelector('video')
            if (this.user.id === data.userId) {
                let timeCalc = parseFloat((video.currentTime - data.currentTime).toFixed(3)) * 1000
                if (timeCalc >= 5600 || timeCalc <= -600) {
                    video.currentTime = data.currentTime
                }
            }
        },
        sendPlayerState(){
            console.log('era para eu enviar o player')
            let video = document.querySelector('video')
            if(this.user.id === this.members[0].id){
                console.log('chegou no sendPlayer')
                let playerState = video.paused
                this.socket.emit('playerState', {room: this.room, userId, playerState, playerCurrentTime})
            }
        },
        verifyVideoState(playerStateData){
            const video = document.querySelector('video')
            console.log('agora vou rerificar o state', playerStateData)
            if (this.user.id != this.members[0].id) {
                let playerState = video.paused
                console.log('o requisitante', playerState, 'o que mandou', playerStateData.playerState)
                if (playerStateData.playerState === false && playerState === true) {
                    video.play()
                }
                if(playerStateData.playerState === true && playerState === false){
                    video.pause()
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
        changeSrc(data){
            let video = document.querySelector('video')
            document.querySelector('source').src = data.cloudFront
            video.load()
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
        emitKeysEvents($event){
            const eventEmit = {
                code: $event.code
            }
            console.log(eventEmit , 'cade o coiso')
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
    .video-container {
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
        outline: none;
        
    }

    svg{
        width: 10%;
        height: 50px;
    }
    .video-container-mobile {
        flex: 2;
        position: relative;
        display: flex;
        flex-direction: column;
        max-width: 853px;
        min-width: 400px;
        height: 480px;
        max-height: 480px;
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
