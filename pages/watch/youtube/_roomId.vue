<template>
    <div class="container-app">
        <Erro :erroProps="err" v-if="err != ''"></Erro>
        <JoinRoomBtn btnProps="clique aqui para começar a assistir" v-if="!joined && !pass" @clicked="JoinRoom()"></JoinRoomBtn>
        <JoinRoomBtn btnProps="clique aqui para começar a assistir" v-if="!joined && owner === user.id && pass" @clicked="JoinRoom()"></JoinRoomBtn>
        <JoinRoomForm labelPassProps="Digite A Senha" inputPlaceholderProps="senha..." inputSubmitProps="Pronto"
            v-if="!joined && pass && owner != user.id" @submitEmited="roomPassVerify($event)"
        />
        <PickVideoYT v-if="showVideos" @ChangeVideo="choiced($event)" @cancel="showVideos = false" />
        <VideoRequestYT :requestInfoProps="requestInfo" v-if="showRequestInfo" @accepted="acceptedRequest($event)" @rejected="rejectedRequest($event)"></VideoRequestYT>
        <RequestList :requestArrayProps="requestWarnList" v-if="requestWarning" @requestSelected="showRequest($event)" ></RequestList>
        <div class="youtube-VideoPlayer" @click="setFocus()" tabindex="1" @keydown="emitKeysEvents($event)" v-if="joined && !mobile" id="video">
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
            @theaterMode="fullScreamToggle($event), theaterModeToggle()"
            @muteUnmute="muteUnmute()"
            :time="currentTime"></ControlsPlayerLiveYT>
            <ChatFullScreen v-show="theater"></ChatFullScreen>
        </div>
        <div class="youtube-VideoPlayer-mobile" tabindex="1" id="video" @keydown="emitKeysEvents($event)" v-if="joined && mobile">
            <div class="wall" @click="emitPlayPause(), setFocus()" @keydown="emitKeysEvents($event)"></div>
            <playerYT class="teste" @error="showError($event)" @cued="AskForSyncronization()" @ready="ready($event)" @playing="playing($event)" :player-vars="{autoplay:0, controls: 0, }" player-width="100%" player-height="100%" :video-id="videoId"></playerYT>
            <ControlsPlayerLiveYtMobile
            @click="setFocus()" 
            @PlayPauseVideo="emitPlayPause()"
            @mouseSegura="mouseSegura"
            @aprenderMatematica="emitAprenderMatematica($event)"
            @setVolume="setVolume"
            @keysEvents="emitKeysEvents($event)"
            @fullScreamToggle="fullScreamToggle($event)"
            @muteUnmute="muteUnmute()"
            :time="currentTime"></ControlsPlayerLiveYtMobile>
        </div>
        <ChatVideo v-show="joined && !mobile && !theater" @clicked="showVideos = !showVideos"/>
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
         
        if (res.room) {
            return {
                roomMembers: res.room.members,
                pass: res.room.pass,
                owner: res.room.userAdm,
            }
        }
        else {
            return {
                roomVideos: undefined,
                pass: false,
            }
        }
    },
    async fetch() {
        try {
            await this.setState()
        } catch (error) {
            throw error
        }
    },
    fetchOnServer: false,
    beforeMount(){
        this.responsive()
    },
    mounted(){
        this.videoId = this.$youtube.getIdFromURL('https://www.youtube.com/embed/hNGrGGbFX2s')
        window.addEventListener('beforeunload', this.emitUserDisconected)
        window.addEventListener('message', event => {
            this.timeUpdateSimulation(event)
        })
        document.addEventListener('fullscreenchange', event => {
            if(!document.fullscreenElement && this.theater) return this.theaterModeToggle()
        })
        setInterval(() => {
            this.sendPlayerState()
        }, 4700);
        setInterval(() => {
            this.askForCurrentTime()
        }, 5000);
    },
    beforeDestroy(){
        this.emitUserDisconected()
    },
    head(){
        return {
            title: 'assistindo pelo Youtube',
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
            roomInfo: {},
            members: [],
            mobile: false,
            currentTime:'00:00',
            videoId: null,
            player: undefined,
            YTjoined: false,
            ytUrl: '',
            adm: undefined,
            choice: undefined,
            videoInfo: [],
            showRequestInfo: false,
            requestInfo: {},
            requestWarnList: [],
            requestWarning: false,
            theater: false,
            

        }
    },
    watch:{
        mediaQuery(value, payload){
             
            this.responsive()
            

        },
        roomInfo(value, payload){
             try{
                 this.checkAdm()
                 this.checkChoice()

             }
             catch(err){
                this.$router.push('/room')
             }

            },
        requestWarnList(value,payload){
             
            value.length === 0 ? this.requestWarning = false : this.requestWarning = true
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
    middleware: ['auth', 'roomPass', 'roomBanned'],
    methods: {
        connectionServer(){
           this.socket = io.connect(' 
https://www.amigitos-espanol-api.com.br/',{ rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling']})
           this.socket.on('sendRequestForSynchronization', data => {
            this.sendVideoUrl(data)
           })
           this.socket.on('listMembersUpdate', data => {
            this.updateMemberRoom(data)
           })
           this.socket.on('msg', data => {
           })
           this.socket.on('setVideoUrl', data => {
            this.setVideoUrl(data)
           })
           this.socket.on('synchronize', data => {
            this.setVideoStatus(data)
           })
           this.socket.on('PlayPause', data => {
             
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
           this.socket.on('playerStateRecived', data => {
            // 
            this.verifyVideoState(data)
           })
           this.socket.on('signal', data => {
           //  
            this.socket.emit('answeredSignal', {roomUrl: this.room})
           })
           this.socket.on('userAskingCurrentTime',data => {
            this.sendCurrentTimeForVerification(data)
           })
           this.socket.on('currentTimeYtRecived',data => {
            this.setOnlyCurrentTime(data)
           })
           this.socket.on('disconnect', q => {
            this.socket.emit('desconectado', q)
           })
           this.socket.on('kickApply', async data => {
            await this.attRoom()
           })
           this.socket.on('muteApply', async data => {
            await this.attRoom()
           })
           this.socket.on('unmuteApply', async data => {
            await this.attRoom()
           })
           this.socket.on('banApply', async data => {
            await this.attRoom()
           })
           this.socket.on('applyAllowChoiceVideos', async data=> {
            await this.attRoom()
           })
           this.socket.on('applyRemoveAllowedMemberChoice', async data => {
            await this.attRoom()
           })
           this.socket.on('applyAdm', async data => {
            await this.attRoom()
           })
           this.socket.on('applyRemoveAdm',async  data => {
            await this.attRoom()
           })
           this.socket.on('requestAllowed', data => {
             
            this.requestAccepted(data)
           })
           this.socket.on('userVideoRequest', data => {
             
            this.addRequest(data)
           })
        },
        ...mapActions({joinByPass: 'user/joinRoomByPassword', getRoom: 'user/getRoom', setState: 'user/setState'}),
        JoinRoom(){
            if (!this.joined) {
                this.joined = true
                this.attRoom(this.room)
            }
        },
        async attRoom(){
             
            let room = await this.getRoom(this.room)
             
            this.roomInfo = room.room
            this.members = room.room.members
        },
        checkAdm(){
             
            let isAdm = this.roomInfo.adms.find(users => {
                return users.id === this.user.id
            })
            isAdm ? this.adm = true : this.adm = false
        },
        checkChoice(){
            let canChoice = this.roomInfo.membersAllowedChoice.find(users => {
                 
                return users.id === this.user.id
            })
            
            canChoice ? this.choice = true : this.choice = false
        },
        updateMemberRoom(member){
            this.members = member
        },
        AskForSyncronization(){
             
            this.socket.emit('requestYTsynchronization', {room: this.room, user: this.user})
        },
        responsive(){
             
            if (this.$mq === 'sm' || this.$mq === "md") {
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
             
        },
        verifyPermissions(video){
             
            if(this.roomInfo.rulesType === 2) {
                 
                if(this.adm || this.choice || this.owner === this.user.id) return true
                else {
                    let videoId = this.saveRequestForVideo(this.ytUrl)
                    this.socket.emit('videoRequest', {userId: this.user.id, userName: this.user.userName, video, room: this.room, id: videoId})
                    return false
                }
            }
            if(this.roomInfo.rulesType === 3){
                 
                if(!this.adm || !this.choice || this.owner === this.user.id) return false
                return true
            }
            return true
        },
        addRequest(data){
             
            if(this.user.id != this.owner) return
             
            let newRequest = data
            this.requestWarnList.push(newRequest)
             
            
        },
        showRequest($event){
             
            this.showRequestInfo = true
            this.requestInfo = $event
        },
        acceptedRequest(data){
            this.socket.emit('requestAccepted', data)
            this.showRequestInfo = false
            this.removeWarn(data)
        },
        rejectedRequest(data){
            this.showRequestInfo = false
            this.removeWarn(data)
        },
        removeWarn(warn){
            let newWarnList = this.requestWarnList.filter(video => {
                 
                return video.id !== warn.id
            })
             
           
             this.requestWarnList = newWarnList
            
             
                
        },
        sendVideoUrl(id){ 
            if(this.members[0].id === this.user.id && this.user.id != id.id) {
                let Url = this.ytUrl
                Url === "" ? Url = 'https://www.youtube.com/embed/hNGrGGbFX2s' : Url
                 
                    let dates = {
                        room: this.room, 
                        userId: id.id,
                        Url
                    }
                    this.socket.emit('UrlSent',dates)       
            }
            if(this.members[0].id === id.id && this.members.length > 1 && this.members[1].id === this.user.id) {
                    let Url = this.ytUrl
                    Url === "" ? Url = 'https://www.youtube.com/embed/hNGrGGbFX2s' : Url
                     
                    let dates = {
                        room: this.room, 
                        userId: id.id,
                        Url
                    }
                    this.socket.emit('UrlSent',dates)
            }
        },
        playing(event){
             
            this.player = event.target
            this.setTimeVideo()

        },
        createVideoRequestId(){
            let Uint32idArray = new Uint32Array(1)
            crypto.getRandomValues(Uint32idArray)
            return Uint32idArray[0].toString(10)
        },
        saveRequestForVideo(video){
             
            let promise = new Promise((resolve, reject) =>{
                return resolve({choiced: this.choiced,video: video})
            })
            let id = this.createVideoRequestId()
            this.videoInfo.push({id, promise})
            return id
        },
        requestAccepted(data){
             
            if(data.requestInfo.userId != this.user.id) return
             
             
            this.videoInfo.forEach(video => {
                 
                if(video.id != data.id) return 
                 
                video.promise.then(result => {
                     
                    result.choiced(result.video, true)
                }).catch(err => {
                     
                })

            })
        },
        removeVideoFromVideoInfo(video){
            const newArray = this.videoInfo.filter(videoInfo => {
                return videoInfo.id != video.id
            })
            this.videoInfo = newArray
        },
        async setVideoUrl(data){
             
            let dates = {
                room: this.room,
                userId:this.user.id
            }
            /* if(data.userId === this.user.id && this.members[0].id === this.user.id && this.members.length > 1) {
                this.videoId = this.$youtube.getIdFromURL(data.Url)
                return this.socket.emit('askForCurrentTime', dates)
                
            }  */
            if(data.userId === this.user.id && this.members[0].id != this.user.id){
                this.videoId = this.$youtube.getIdFromURL(data.Url)
                return this.socket.emit('askForCurrentTime', dates)
            }
        },
        ready(event){
            this.player = event.target
            if (!this.YTjoined) {
                this.connectionServer()
                 
                this.socket.emit('joinRoom', {user: this.user, room: this.room})
                 
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
                 
                if (dates.videoStats.paused === 1){
                     
                    this.player.playVideo()
                    this.player.seekTo(dates.videoStats.currentTime)
                    play.src = '/svg/botao_pause.svg'
                }
                
            }
        },
        roomPassVerify(event){
            this.joinByPass({password: event.password,roomUrl: this.room, token: this.$cookies.get('token')}).then(correct => {
                 
                if(correct.correct === true) {
                    this.JoinRoom()
                    this.err = ''
                }
            }).catch(err => {
                 
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
            if(this.socket === null) return
            this.socket.emit('playPause', {event: $event, room: this.room})

        },
        sendPlayerState(){
            // 
            // 
            if(this.user.id === this.members[0].id){
               // 
                let playerState = this.player.getPlayerState()
                this.socket.emit('playerState', {room: this.room, playerState})
            }
        },
        askForCurrentTime(){
            if (this.user.id != this.members[0].id) {
                this.socket.emit('askingYtCurrentTime', {userId: this.user.id, room: this.room})
            }
        },
        sendCurrentTimeForVerification(data){
            if (this.user.id === this.members[0].id) {
                let currentTime = this.player.getCurrentTime()
                this.socket.emit('currentTimeYt', {currentTime, userId: data.userId, room: this.room})
                
            }
        },
        setOnlyCurrentTime(data){
            if (this.user.id === data.userId) {
                let timeCalc = parseFloat((this.player.getCurrentTime() - data.currentTime).toFixed(3)) * 1000
                 
                if (timeCalc >= 600 || timeCalc <= -600) {
                    this.player.seekTo(data.currentTime)
                }
            }
        },
        verifyVideoState(playerStateData){
            // 
            if (this.user.id != this.members[0].id) {
                let playerState = this.player.getPlayerState()
                // 
                if (playerStateData.playerState === 1 && playerState === 2) {
                    this.player.playVideo()
                }
                if(playerStateData.playerState === 2){
                    this.player.pauseVideo()
                }     
                
            }
            

        },
        PlayPauseVideo(){
            const play = document.querySelector('.play-pause-icon')
             
            if (this.player.getPlayerState() === 2 || this.player.getPlayerState() === 5 || this.player.getPlayerState() === -1) {
                this.player.playVideo()

                 
                play.src = '/svg/botao_pause.svg'
            }
            else {
                this.player.pauseVideo()
                play.src = '/svg/botao_play_.svg'
            }
             
        },
        showObject(event){
             
        },
        choiced(video, canSend = undefined){
             
              
            this.showVideos = false
            let videoEmbed = video.embed || video
            videoEmbed === '' ? video = "https://www.youtube.com/embed/hNGrGGbFX2s" : video
            this.ytUrl = video.embed
            let hasPermision = undefined
            canSend === undefined ? hasPermision = this.verifyPermissions(video.original) : hasPermision = canSend
            canSend === undefined ? canSend = hasPermision : canSend = canSend
            if (!hasPermision){
                 
                if(!canSend) return
            }
             
            this.socket.emit('changeVideoToAll', {video: video.embed || video, room: this.room})
        },
        changeSrc(data){
             
            this.videoId = this.$youtube.getIdFromURL(data)
            this.ytUrl = data
        },
        GaloFilhoDaPuta(){
            const barra = document.querySelector('.progress-bar')
            if(!this.player) return
            if(barra){
                barra.style.width = `${this.player.getCurrentTime() / this.player.getDuration() * 100}%`
            }
        },
        setTimeVideo(){
            if(this.player === undefined) return
            let tempVideo = Math.floor(this.player.getCurrentTime())
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
            this.currentTime = time
        },
        emitKeysEvents($event){
            const eventEmit = {
                code: $event.code
            }
             
            this.socket.emit('keysEvents', {event: eventEmit, room: this.room})

        },
        keysEvents(key){
             
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
            volume > 1 ? volume = 1 : volume < 0 ? volume = 0 : volume = volume
             
            this.player.setVolume(volume * 100)
            this.oldVolume = volume
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
                 
                let position = ($event.offsetX / $event.target.offsetWidth) * video.duration
                video.currentTime = position
                const barra = document.querySelector('.progress-bar')
                barra.style.width = `${this.player.getCurrentTime() / this.player.getDuration() * 100}%`
                
            }
        },
        fullScreamToggle() {
            let video = document.querySelector('.youtube-VideoPlayer') || document.querySelector('.youtube-VideoPlayer-mobile')
            const fullscreenIcon = document.querySelector('.fullScreem-icon')
            if (!document.fullscreenElement) {
                fullscreenIcon.src = '/svg/sair_da_tela_cheia_.svg'
                video.requestFullscreen()
            }
            else {
                fullscreenIcon.src = '/svg/tela_cheia.svg'
                document.exitFullscreen()
                this.theater = false
            }
        },
        theaterModeToggle(){
            !this.theater ? this.theater = true : this.theater = false 
        },
        muteUnmute(){
            const volumeValue = document.querySelector('.volume')
            const volumeIcon = document.querySelector('.volume-icon')
             
            if (this.player.getVolume() > 0) {
                this.player.mute()
                this.player.setVolume(0)
                volumeValue.value = 0
                volumeIcon.src = '/svg/sem_som.svg'    
            }
            else {
                 
                this.player.unMute()
                this.player.setVolume(this.oldVolume * 100)
                volumeValue.value = this.oldVolume * 100
                volumeIcon.src = '/svg/com_som.svg'    
            }
        },
        emitUserDisconected(){
            if (this.socket) {
                this.socket.emit('desconectado', {user: this.user, room: this.room})
                this.disconnectRoom()
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
        position: relative;
    
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
        max-height: 480px;
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
    @media screen and (max-width: 760px) {
        .youtube-VideoPlayer-mobile {
            flex: 2;
            width: 100%;
            min-height: 200px;
            position: relative;
            height: 97vh;
            max-height: 480px;
        }
        .youtube-VideoPlayer-mobile .teste, #youtube-player-1 {
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
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
        .youtube-VideoPlayer-mobile {
            min-width: 360px;
            width: 100%;
            position: relative;
        }
        .youtube-VideoPlayer-mobile #video {
           width: 100%;
        }
       .youtube-VideoPlayer-mobile .teste, #youtube-player-1 {
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
        }
        
    }
        


</style>