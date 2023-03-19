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
            @muteUnmute="muteUnmute()"
            :time="currentTime"></ControlsPlayerLiveYT>
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

        }
    },
    watch:{
        mediaQuery(value, payload){
            console.log(value)
            this.responsive()
            

        },
        roomInfo(value, payload){
            console.log(value, payload, 'room sendo atualizada')
            this.checkAdm()
            this.checkChoice()

            },
        requestWarnList(value,payload){
            console.log(value, 'requestWARN 11111', payload)
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
           this.socket = io.connect('http://localhost:3333/',{ rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling']})
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
            console.log("video que estou enviando", data)
            this.changeSrc(data)
           })
           this.socket.on('userAskingForSyncronization', data => {
            this.sendCurrentTime(data.user)
           })
           this.socket.on('currentTimeRecived', data => {
            this.setCurrentTime(data)
           })
           this.socket.on('playerStateRecived', data => {
            //console.log('recebi o player', data)
            this.verifyVideoState(data)
           })
           this.socket.on('signal', data => {
           // console.log("o sinal chegou até aqui")
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
            console.log(data, 'la data')
            this.requestAccepted(data)
           })
           this.socket.on('userVideoRequest', data => {
            console.log('como assim undefined?', data)
            this.addRequest(data)
           })
        },
        ...mapActions({joinByPass: 'user/joinRoomByPassword', getRoom: 'user/getRoom'}),
        JoinRoom(){
            if (!this.joined) {
                this.joined = true
                this.attRoom(this.room)
            }
        },
        async attRoom(){
            console.log('el room sendo att')
            let room = await this.getRoom(this.room)
            console.log(room, 'o room', room.room)
            this.roomInfo = room.room
        },
        checkAdm(){
            console.log(this.roomInfo, 'infos')
            let isAdm = this.roomInfo.adms.find(users => {
                return users.id === this.user.id
            })
            isAdm ? this.adm = true : this.adm = false
        },
        checkChoice(){
            let canChoice = this.roomInfo.membersAllowedChoice.find(users => {
                console.log(users.id)
                return users.id === this.user.id
            })
            
            canChoice ? this.choice = true : this.choice = false
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
            console.log('deu erro no player lol', event)
        },
        verifyPermissions(video){
            console.log(this.roomInfo)
            if(this.roomInfo.rulesType === 2) {
                console.log('rooomInfo2', this.adm, this.choice)
                if(this.adm || this.choice || this.owner === this.user.id) return true
                else {
                    let videoId = this.saveRequestForVideo(this.ytUrl)
                    this.socket.emit('videoRequest', {userId: this.user.id, userName: this.user.userName, video, room: this.room, id: videoId})
                    return false
                }
            }
            if(this.roomInfo.rulesType === 3){
                console.log('rooomInfo2', this.adm, this.choice,)
                if(!this.adm || !this.choice || this.owner === this.user.id) return false
                return true
            }
            return true
        },
        addRequest(data){
            console.log('chegou no add request', this.user.id, this.owner, this.adm, data)
            if(this.user.id != this.owner) return
            console.log('passou do if')
            let newRequest = data
            this.requestWarnList.push(newRequest)
            console.log(this.requestWarnList,'puxado')
            
        },
        showRequest($event){
            console.log($event, ' evento show request')
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
                console.log(warn.id,video.id, 'filter')
                return video.id !== warn.id
            })
            console.log(warn, newWarnList, 'resultado warn list')
           
             this.requestWarnList = newWarnList
            
            console.log(this.requestWarnList,'era para ter sidozerado')
                
        },
        sendVideoUrl(id){ 
            if(this.members[0].id === this.user.id && this.user.id != id.id) {
                let Url = this.ytUrl
                Url === "" ? Url = 'https://www.youtube.com/embed/hNGrGGbFX2s' : Url
                console.log(this.ytUrl, 'estou enviando essa url')
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
                    console.log(this.ytUrl, 'estou enviando essa url 2')
                    let dates = {
                        room: this.room, 
                        userId: id.id,
                        Url
                    }
                    this.socket.emit('UrlSent',dates)
            }
        },
        playing(event){
            console.log(event.target, 'ta vindo aq?, não')
            this.player = event.target
            this.setTimeVideo()

        },
        createVideoRequestId(){
            let Uint32idArray = new Uint32Array(1)
            crypto.getRandomValues(Uint32idArray)
            return Uint32idArray[0].toString(10)
        },
        saveRequestForVideo(video){
            console.log('salvando', video)
            let promise = new Promise((resolve, reject) =>{
                return resolve({choiced: this.choiced,video: video})
            })
            let id = this.createVideoRequestId()
            this.videoInfo.push({id, promise})
            return id
        },
        requestAccepted(data){
            console.log('data do request aceito', data)
            if(data.requestInfo.userId != this.user.id) return
            console.log(data)
            console.log(this.videoInfo)
            this.videoInfo.forEach(video => {
                console.log(video.id, data.id)
                if(video.id != data.id) return 
                console.log(video, ' videooou')
                video.promise.then(result => {
                    console.log(result,'resultado')
                    result.choiced(result.video, true)
                }).catch(err => {
                    console.log('chegamos no erro final')
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
            console.log('esse sim é o video que to recebendo lol', data)
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
            if(this.socket === null) return
            this.socket.emit('playPause', {event: $event, room: this.room})

        },
        sendPlayerState(){
            //console.log('era para eu enviar o player')
            //console.log(this.user.id, this.members[0].id)
            if(this.user.id === this.members[0].id){
               //console.log('chegou no sendPlayer')
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
                console.log('esse log é pra voce gusta', timeCalc)
                if (timeCalc >= 600 || timeCalc <= -600) {
                    this.player.seekTo(data.currentTime)
                }
            }
        },
        verifyVideoState(playerStateData){
            //console.log('agora vou rerificar o state', playerStateData)
            if (this.user.id != this.members[0].id) {
                let playerState = this.player.getPlayerState()
                //console.log('o requisitante', playerState, 'o que mandou', playerStateData.playerState)
                if (playerStateData.playerState === 1 && playerState === 2) {
                    this.player.playVideo()
                }
                if(playerStateData.playerState === 2 && playerState === 1){
                    this.player.pauseVideo()
                }     
                
            }
            

        },
        PlayPauseVideo(){
            const play = document.querySelector('.play-pause-icon')
            console.log(this.player.getPlayerState(),'cadeeeeee', this.player.getVideoData())
            if (this.player.getPlayerState() === 2 || this.player.getPlayerState() === 5 || this.player.getPlayerState() === -1) {
                this.player.playVideo()

                console.log('vou dar play?', this.player)
                play.src = '/svg/botao_pause.svg'
            }
            else {
                this.player.pauseVideo()
                play.src = '/svg/botao_play_.svg'
            }
            console.log('saudades')
        },
        showObject(event){
            console.log(event)
        },
        choiced(video, canSend = undefined){
            console.log(video, 'esse é o video enviado')
             console.log(this.roomInfo, 'INFOOOOOOOOO', this.roomInfo)
            this.showVideos = false
            let videoEmbed = video.embed || video
            videoEmbed === '' ? video = "https://www.youtube.com/embed/hNGrGGbFX2s" : video
            this.ytUrl = video.embed
            let hasPermision = undefined
            canSend === undefined ? hasPermision = this.verifyPermissions(video.original) : hasPermision = canSend
            canSend === undefined ? canSend = hasPermision : canSend = canSend
            if (!hasPermision){
                console.log('entrou no if que deveria parar', canSend)
                if(!canSend) return
            }
            console.log('estou enviando o video', video)
            this.socket.emit('changeVideoToAll', {video: video.embed || video, room: this.room})
        },
        changeSrc(data){
            console.log('video que recebi quando entrei', data)
            this.videoId = this.$youtube.getIdFromURL(data)
            this.ytUrl = data
        },
        GaloFilhoDaPuta(){
            const barra = document.querySelector('.progress-bar')
            if(!this.player()) return
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
            //console.log(minutos, minutos / 60)
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
            console.log(eventEmit, ' cade o coiso')
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
            let video = document.querySelector('.youtube-VideoPlayer') || document.querySelector('.youtube-VideoPlayer-mobile')
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
            const volumeValue = document.querySelector('.volume')
            const volumeIcon = document.querySelector('.volume-icon')
            console.log('o volume', this.player.getVolume())
            if (this.player.getVolume() > 0) {
                this.player.mute()
                this.player.setVolume(0)
                volumeValue.value = 0
                volumeIcon.src = '/svg/sem_som.svg'    
            }
            else {
                console.log(this.oldVolume)
                this.player.unMute()
                this.player.setVolume(this.oldVolume * 100)
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