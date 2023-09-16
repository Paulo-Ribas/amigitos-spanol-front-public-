<template>
    <div class="container-app">
        <Erro :erroProps="err" v-if="err != ''"></Erro>
        <JoinRoomBtn btnProps="clique aqui para começar a assistir" v-if="!joined && !pass" @clicked="JoinRoom()">
        </JoinRoomBtn>
        <JoinRoomBtn btnProps="clique aqui para começar a assistir" v-if="!joined && owner === user.id && pass"
            @clicked="JoinRoom()"></JoinRoomBtn>
        <JoinRoomForm labelPassProps="Digite A Senha" inputPlaceholderProps="senha..." inputSubmitProps="Pronto"
            v-if="!joined && pass && owner != user.id" @submitEmited="roomPassVerify($event)" />
        <PickVideo :videosProps="filesVideos" v-show="showVideos" @ChangeVideo="choiced($event)"
            @cancel="showVideos = false" />
        <VideoRequest :requestInfoProps="requestInfo" v-if="showRequestInfo" @accepted="acceptedRequest($event)"
            @rejected="rejectedRequest($event)"></VideoRequest>
        <RequestList :requestArrayProps="requestWarnList" v-if="requestWarning" @requestSelected="showRequest($event)">
        </RequestList>
        <div class="video-container" v-if="joined && !mobile">
            <Transition name="actions">
                <div class="UserActions" v-if="userAction">
                    <span class="userActionName">
                        {{ executedAction.name }}
                    </span>
                </div>
            </Transition>
            <video @loadedmetadata="setDuration" @loadeddata="setDuration" @timeupdate="GaloFilhoDaPuta()" tabindex="1"
                @dblclick="fullScreamToggle()" @click="showObject(), emitPlayPause()" @keydown="emitKeysEvents($event)"
                id="video">
                <source src="/videoplayback.mp4" type="video/mp4">
            </video>
            <ControlsPlayerLive :time="currentTime" :durationProps="duration" @PlayPauseVideo="emitPlayPause($event)"
                @mouseSegura="mouseSegura" @setVolume="setVolume" @aprenderMatematica="emitAprenderMatematica($event)"
                @keysEvents="emitKeysEvents($event)" @fullScreamToggle="fullScreamToggle($event)" @muteUnmute="muteUnmute()"
                @theaterMode="fullScreamToggle($event), theaterModeToggle()" />
            <ChatFullScreen :chatProps="msgsForProps" v-if="theater"></ChatFullScreen>
        </div>
        <div class="video-container-mobile" v-if="joined && mobile">
            <Transition name="actions">
                <div class="UserActions" v-if="userAction">
                    <span class="userActionName">
                        {{ executedAction.name }}
                    </span>
                </div>
            </Transition>
            <video @timeupdate="GaloFilhoDaPuta()" tabindex="1" @dblclick="fullScreamToggle()"
                @click="showObject(), emitPlayPause()" @keydown="emitKeysEvents($event)" @loadedmetadata="setDuration"
                @loadeddata="setDuration" id="video">
                <source src="/videoplayback.mp4" type="video/mp4">
            </video>
            <ControlsPlayerLiveMobile :time="currentTime" :durationProps="duration" @PlayPauseVideo="emitPlayPause($event)"
                @mouseSegura="mouseSegura" @setVolume="setVolume" @aprenderMatematica="emitAprenderMatematica($event)"
                @keysEvents="emitKeysEvents($event)" @fullScreamToggle="fullScreamToggle($event)"
                @muteUnmute="muteUnmute()" />
        </div>
        <ChatPcVideo :chatProps="msgsForProps" v-if="joined && !mobile" @clicked="showVideos = !showVideos"></ChatPcVideo>
        <ChatMobileVideo :chatProps="msgsForProps" v-if="joined && mobile" @clicked="showVideos = !showVideos"></ChatMobileVideo>
    </div>
</template>
<script>
import io from 'socket.io-client'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    name: 'dwV',
    layout: 'defualt',
    async asyncData(context) {
        let res = await context.store.dispatch('user/getRoom', context.params.roomId)

        if (res.room) {
            return {
                roomVideos: res.room.filesVideos,
                roomMembers: res.room.members,
                pass: res.room.pass,
                owner: res.room.userAdm,
                roomAdm: [{ userAdm: res.room.userAdm }]
            }
        }
        else {
            return {
                roomVideos: undefined,
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
    beforeMount() {
        this.responsive()
    },
    async mounted() {
        window.addEventListener('beforeunload', this.emitUserDisconected)
        document.addEventListener('fullscreenchange', event => {
            if (!document.fullscreenElement && this.theater) return this.theaterModeToggle()
        })
        this.sendPlayerStateInterval = setInterval(() => {
            this.sendPlayerState()
        }, 4700);
        this.askForCurrentTimeInterval = setInterval(() => {
            this.askForCurrentTime()
        }, 5000);
        this.memberIsMembersInterval = setInterval(() => {
            if (this.$route.fullPath === `/watch/upload/${this.room}` || this.$route.fullPath === `/watch/youtube/${this.room}`) {
                this.checkIfMemberIsMember()
            }
        }, 12000);
        return
    },
    beforeDestroy() {
        this.emitUserDisconected()
        clearInterval(this.memberIsMembersInterval)
        clearInterval(this.sendPlayerStateInterval)
        clearInterval(this.askForCurrentTimeInterval)
    },
    head() {
        return {
            title: 'assistindo pelo Uploads',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: 'description', name: 'description', content: 'um site feito em homenagem para um antigo grupo, aqui você pode assistir videos ao mesmo tempo com seus amigos, tanto pelo youtube ou você mesmo fazendo upload deles' },
                { name: 'format-detection', content: 'telephone=no' },
                { name: 'robots', content: 'nofollow' },
                { name: 'author', content: 'Paulo Ribas' },
            ]
        }
    },
    data() {
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
            currentTime: '00:00',
            duration: '00:00',
            adm: undefined,
            choice: undefined,
            videoInfo: [],
            showRequestInfo: false,
            requestInfo: {},
            requestWarnList: [],
            requestWarning: false,
            theater: false,
            roomInfo: {},
            userAction: false,
            executedAction: {},
            msgsForProps: [],
            memberIsMembersInterval: undefined,
            sendPlayerStateInterval: undefined,
            askForCurrentTimeInterval: undefined,
        }
    },
    watch: {
        mediaQuery(value, payload) {
            this.responsive()
        },
        roomInfo(value, payload) {
            try {
                this.checkAdm()
                this.checkChoice()

            }
            catch (err) {
                this.$router.push('/room')
            }

        },
        requestWarnList(value, payload) {

            value.length === 0 ? this.requestWarning = false : this.requestWarning = true
        },
        currentTime(value, payload) {
            let NaNSplit = value.split('N')
            if (NaNSplit.length > 1) this.currentTime = '00:00'
        },
        duration(value, payload) {
            let NaNSplit = value.split('N')
            if (NaNSplit.length > 1) this.duration = '00:00'

        }
    },
    computed: {
        ...mapState({ user: state => state.user }),
        filesVideos() {
            if (this.roomVideos) {
                return this.roomVideos

            }
            else {
                return []
            }
        },
        membersReactive() {
            return this.members

        },
        mediaQuery() {
            return this.$mq
        }
    },
    middleware: ['auth', 'roomPass', 'roomBanned'],
    methods: {
        connectionServer() {
            this.socket = io.connect('https://amigitos-espanol-api.com.br/', { rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling'] })
            this.socket.on('sendRequestForSynchronization', data => {
                this.sendVideoUrl(data)
            })
            this.socket.on('listMembersUpdate', data => {
                this.updateMemberRoom(data)
            })
            this.socket.on('msgForBackUp', data => {
                this.addMsg(data)
            })
            this.socket.on('requestMsg', data => {
                this.sendChat(data)
            })
            this.socket.on('secondMemberSendChat', data => {
                this.chatAttemptTwo(data)
            })
            this.socket.on('chatRecived', data => {
                this.attChat(data)
            })
            this.socket.on('setVideoUrl', data => {
                this.setVideoUrl(data)
            })
            this.socket.on('synchronize', data => {
                this.setVideoStatus(data)
            })
            this.socket.on('PlayPause', data => {
                this.PlayPauseVideo()
                this.setUserActions(data.actions)
            })
            this.socket.on('keysEvents', key => {
                this.keysEvents(key.event)
                this.setUserActions(key.event.actions)

            })
            this.socket.on('aprenderMatematica', data => {
                this.aprenderMatematica(data)
                this.setUserActions(data.actions)

            })
            this.socket.on('changeVideo', data => {
                this.changeSrc(data)
                this.setUserActions(data.actions)

            })
            this.socket.on('userAskingForSyncronization', data => {
                this.sendCurrentTime(data.user)
            })
            this.socket.on('currentTimeRecived', data => {
                this.setCurrentTime(data)
            })
            this.socket.on('signal', data => {
                console.log('sinal chegou aqui')

                this.socket.emit('answeredSignal', { roomUrl: this.room })
            })
            this.socket.on('playerStateRecived', data => {
                this.verifyVideoState(data)
            })
            this.socket.on('userAskingCurrentTime', data => {
                this.sendCurrentTimeForVerification(data)
            })
            this.socket.on('currentTimeUploadRecived', data => {
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
            this.socket.on('applyAllowChoiceVideos', async data => {
                await this.attRoom()
            })
            this.socket.on('applyRemoveAllowedMemberChoice', async data => {
                await this.attRoom()
            })
            this.socket.on('applyAdm', async data => {
                await this.attRoom()
            })
            this.socket.on('applyRemoveAdm', async data => {
                await this.attRoom()
            })
            this.socket.on('requestAllowed', data => {

                this.requestAccepted(data)
            })
            this.socket.on('userVideoRequest', data => {

                this.addRequest(data)
            })
        },
        ...mapActions({ joinByPass: 'user/joinRoomByPassword', getRoom: 'user/getRoom', setState: 'user/setState' }),
        async attRoom() {

            let roomInfo = await this.getRoom(this.room)
            this.roomInfo = roomInfo.room
            this.members = roomInfo.room.members
            this.membersReactive = roomInfo.room.members
        },
        JoinRoom() {
            if (!this.joined) {
                this.connectionServer()

                this.socket.emit('joinRoom', { user: this.user, room: this.room })
                this.joined = true
            }
        },
        checkAdm() {

            let isAdm = this.roomInfo.adms.find(users => {
                return users.id === this.user.id
            })
            isAdm ? this.adm = true : this.adm = false
        },
        checkChoice() {
            let canChoice = this.roomInfo.membersAllowedChoice.find(users => {

                return users.id === this.user.id
            })

            canChoice ? this.choice = true : this.choice = false
        },
        async updateMemberRoom(member) {
            await this.attRoom()
        },
        async checkIfMemberIsMember() {
            let user = this.membersReactive.find(member => {
                return member.id === this.user.id

            })
            if (user) return
            this.$router.push('/room')
        },
        sendChat(data) {
            let userRequest = data.user
            let room = this.room
            let chat = this.msgsForProps
            let chatEmpty = false
            let newUserThatSendTheChat = undefined 
            if (chat.length === 0) {
                chatEmpty = true
            }
            if (this.members[0].id != this.user.id && this.members[0].id != userRequest) return
            if (this.members[0].id === userRequest && this.members.length === 1) return
            if (this.members[0].id === userRequest && this.members.length >= 2) {
                newUserThatSendTheChat = this.members[1].id
            }
            if (chatEmpty && this.members.length >= 2) {
                newUserThatSendTheChat = this.members[1].id
            }

            if (!newUserThatSendTheChat) return this.socket.emit('chatSent', { userRequest, room, chat, empty: false })
            if (newUserThatSendTheChat) return this.socket.emit('chatSecondChance', { userRequest, room, chat, newUserThatSendTheChat })
        },
        chatAttemptTwo(data) {
            let userRequest = data.userRequest
            let whoSentChat = data.newUserThatSendTheChat
            let room = this.room
            let chat = this.msgsForProps
            let chatEmpty = false
            if (this.user.id != whoSentChat) return
            if (chat.length === 0) {
                chatEmpty = true
            }
            if (chatEmpty) return this.socket.emit('chatSent', { userRequest, room, chat, empty: true })
            if (!chatEmpty) return this.socket.emit('chatSent', { userRequest, room, chat, empty: false })


        },
        attChat(data) {
            this.msgsForProps = data.chat
        },
        addMsg(msg) {
            let msgText = msg.text
            let emojiVerify = msg.text.split('|')
            let emoji
            if (emojiVerify[0] === "(-emoji#)") {
                emoji = true

                let newMsgFormat = emojiVerify[1]
                msgText = newMsgFormat
            }
            let mensagem = {
                userName: msg.userName,
                userImg: msg.userImg,
                text: msgText,
                emoji: emoji,
                id: msg.userId
            }

            this.msgsForProps.push(mensagem)

        },
        responsive() {
            console.log(this.$mq)
            if (this.$mq === 'sm' || this.$mq === "md") {
                this.mobile = true
                console.log(this.mobile)
            }
            else {
                this.mobile = false
            }
        },
        sendVideoUrl(id) {
            let Url = document.querySelector('source').src
            let dates = {
                room: this.room,
                userId: id.id,
                Url
            }
            if (this.members[0].id === this.user.id && this.user.id != id.id) return this.socket.emit('UrlSent', dates)
            if (this.members[0].id === id.id && this.members.length > 1 && this.members[1].id === this.user.id) return this.socket.emit('UrlSent', dates)
        },
        async setVideoUrl(data) {
            let source = document.querySelector('source')
            let video = document.getElementById('video')
            let dates = {
                room: this.room,
                userId: this.user.id
            }
            if (data.userId === this.user.id && this.members[0].id != this.user.id) {
                source.setAttribute('src', data.Url)
                video.load()
                setTimeout(async () => {
                    try {

                        await this.awaitLOad()

                        return this.socket.emit('askForCurrentTime', dates)

                    } catch (error) {
                        this.err = 'ocorreu um erro durante a sincronização'
                    }
                }, 1000);

            }
        },
        awaitLOad() {
            return new Promise((resolve, reject) => {
                let video = document.getElementById('video')
                let Try = 0
                let interval = setInterval(() => {
                    Try++
                    if (video.buffered.length > 0) {
                        clearInterval(interval)
                        return resolve(true)

                    }
                    if (Try >= 20) {
                        clearInterval(interval)
                        return reject(true)
                    }

                }, 1000);
            })
        },
        sendCurrentTime(user) {

            let video = document.getElementById('video')
            let videoStats = {
                room: this.room,
                userId: user,
                videoStats: {
                    currentTime: video.currentTime,
                    paused: video.paused,
                }
            }


            if (this.members[0].id === this.user.id && this.user.id != user) return this.socket.emit('sentCurrentTime', videoStats)
            if (this.members[0].id === user && this.members.length > 1 && this.members[1].id === this.user.id) return this.socket.emit('sentCurrentTime', videoStats)

        },
        setCurrentTime(dates) {
            let video = document.getElementById('video')
            if (this.user.id === dates.user) {
                video.currentTime = dates.videoStats.currentTime
                if (!dates.videoStats.paused) {
                    video.play()
                }

            }
        },
        askForCurrentTime() {
            if (this.user.id != this.members[0].id) {
                this.socket.emit('askingUploadCurrentTime', { userId: this.user.id, room: this.room })
            }
        },
        sendCurrentTimeForVerification(data) {
            let video = document.querySelector('video')
            if (this.user.id === this.members[0].id) {
                let currentTime = video.currentTime
                this.socket.emit('currentTimeUpload', { currentTime, userId: data.userId, room: this.room })

            }
        },
        setOnlyCurrentTime(data) {
            let video = document.querySelector('video')


            if (this.user.id === data.userId) {
                let timeCalc = parseFloat((video.currentTime - data.currentTime).toFixed(3)) * 1000
                if (timeCalc >= 600 || timeCalc <= -600) {
                    video.currentTime = data.currentTime
                }
            }
        },
        sendPlayerState() {
            let video = document.querySelector('video')
            if (this.user.id === this.members[0].id) {
                let playerState = video.paused
                this.socket.emit('playerState', { room: this.room, userId: this.user.id, playerState })
            }
        },
        verifyVideoState(playerStateData) {
            const video = document.querySelector('video')

            if (this.user.id != this.members[0].id) {
                let playerState = video.paused

                if (playerStateData.playerState === false && playerState === true) {
                    video.play()
                }
                if (playerStateData.playerState === true && playerState === false) {
                    video.pause()
                }

            }


        },
        requestAccepted(data) {

            if (data.requestInfo.userId != this.user.id) return


            this.videoInfo.forEach(video => {

                if (video.id != data.id) return

                video.promise.then(result => {

                    result.choiced(result.video, true)
                }).catch(err => {

                })

            })
        },
        addRequest(data) {

            if (this.user.id != this.owner) return

            let newRequest = data
            this.requestWarnList.push(newRequest)


        },
        showRequest($event) {

            this.showRequestInfo = true
            this.requestInfo = $event
        },
        acceptedRequest(data) {
            this.socket.emit('requestAccepted', data)
            this.showRequestInfo = false
            this.removeWarn(data)
        },
        rejectedRequest(data) {
            this.showRequestInfo = false
            this.removeWarn(data)
        },
        removeWarn(warn) {
            let newWarnList = this.requestWarnList.filter(video => {

                return video.id !== warn.id
            })


            this.requestWarnList = newWarnList



        },
        roomPassVerify(event) {
            this.joinByPass({ password: event.password, roomUrl: this.room, token: this.$cookies.get('token') }).then(correct => {

                if (correct.correct === true) {
                    this.JoinRoom()
                    this.err = ''
                }
            }).catch(err => {

                this.err = err.response.data.err
            })

        },
        disconnectRoom(user) {
            this.joined = false
            if (this.socket) {
                this.PlayPauseVideo()
                this.socket.emit('desconectado', { user: user })
                this.socket.disconnect(true)
            }
        },
        addFocus() {
            const video = document.getElementById('video')
            video.classList.add('focus')
        },
        emitPlayPause($event) {
            let actions = {
                name: this.user.userName,
                action: 'play'
            }
            this.socket.emit('playPause', { event: $event, room: this.room, actions })

        },
        PlayPauseVideo() {
            const video = document.getElementById('video')

            const play = document.querySelector('.play-pause-icon')

            if (video.paused) {
                video.play()
                play.src = '/svg/botao_pause.svg'
            }
            else {
                video.pause()
                play.src = '/svg/botao_play_.svg'
            }
        },
        setUserActions(data) {
            this.userAction = false
            let action = {
                name: data.name,
                action: data.action
            }
            this.executedAction = action
            this.userAction = true
            setTimeout(() => {
                this.userAction = false
            }, 500);
        },
        showObject(event) {

        },
        choiced(video, canSend = undefined) {

            this.showVideos = false
            let hasPermision = undefined
            canSend === undefined ? hasPermision = this.verifyPermissions(video) : hasPermision = canSend
            canSend === undefined ? canSend = hasPermision : canSend = canSend
            if (!hasPermision) {

                if (!canSend) return
            }
            let actions = {
                name: this.user.userName,
                action: 'play'
            }

            this.socket.emit('changeVideoToAll', { video: video, room: this.room, actions })
        },
        verifyPermissions(video) {
            console.log(this.roomInfo.rulesType, this.adm || this.choice || this.owner === this.user.id )
            if (this.roomInfo.rulesType === 2) {

                if (this.adm || this.choice || this.owner === this.user.id) return true
                else {
                    let videoId = this.saveRequestForVideo(video)
                    this.socket.emit('videoRequest', { userId: this.user.id, userName: this.user.userName, location: video.location, thumb: video.thumbnailLocation, name: video.fileName, video, room: this.room, id: videoId })
                    return false
                }
            }
            if (this.roomInfo.rulesType === 3) {

                if (!this.adm || !this.choice || this.owner === this.user.id) return false
                return true
            }
            return true
        },
        saveRequestForVideo(video) {

            let promise = new Promise((resolve, reject) => {
                return resolve({ choiced: this.choiced, video: video })
            })
            let id = this.createVideoRequestId()
            this.videoInfo.push({ id, promise })
            return id
        },
        createVideoRequestId() {
            let Uint32idArray = new Uint32Array(1)
            crypto.getRandomValues(Uint32idArray)
            return Uint32idArray[0].toString(10)
        },
        changeSrc(data) {
            let video = document.querySelector('video')
            document.querySelector('source').src = data.cloudFront
            video.load()
        },
        GaloFilhoDaPuta() {
            const video = document.getElementById('video')
            const barra = document.querySelector('.progress-bar')
            if (barra) {
                barra.style.width = `${video.currentTime / video.duration * 100}%`
            }
            this.setTimeVideo()
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
        emitKeysEvents($event) {
            if ($event.key.code === 'f') return this.fullScreamToggle()
            const eventEmit = {
                code: $event.code,
                actions: {
                    name: this.user.userName,
                    action: 'play'
                }
            }

            this.socket.emit('keysEvents', { event: eventEmit, room: this.room })

        },
        keysEvents(key) {
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
        setVolume(volume) {
            const video = document.getElementById('video')

            volume > 1 ? volume = 1 : volume < 0 ? volume = 0 : volume = volume
            video.volume = volume
            this.oldVolume = volume
        },
        skip5Seconds() {
            const video = document.getElementById('video')

            video.currentTime = video.currentTime + 5
        },
        return5Seconds() {
            const video = document.getElementById('video')

            video.currentTime = video.currentTime - 5
        },
        emitAprenderMatematica($event) {
            const eventEmit = {
                offsetX: $event.offsetX,
                target: {
                    offsetWidth: $event.target.offsetWidth
                },
                actions: {
                    name: this.user.userName,
                    action: 'setTime'
                }

            }
            this.socket.emit('aprenderMatematica', { room: this.room, event: eventEmit })
        },
        aprenderMatematica($event) {
            const video = document.getElementById('video')

            let position = ($event.offsetX / $event.target.offsetWidth) * video.duration
            video.currentTime = position


        },
        mouseSegura() {
            const progress = document.querySelector('.progress')
            progress.classList.add('focus')
        },
        mouseEventHandler($event) {
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
        theaterModeToggle() {
            !this.theater ? this.theater = true : this.theater = false
        },
        muteUnmute() {
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
        },
        emitUserDisconected() {
            if (this.socket) {
                this.socket.emit('desconectado', { user: this.user, room: this.room })
                setTimeout(() => {
                    this.socket.disconnect()
                }, 1000);
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
    overflow: hidden;
}

video {
    position: absolute;
    width: 100%;
    height: 100%;
    outline: none;
    background-color: var(--chatOpacity);

}

svg {
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
    overflow: hidden;
}

.UserActions {
    width: 100%;
    position: absolute;
    top: 5%;
    display: flex;
    justify-content: center;
    z-index: 6;
}

.actions-enter-active {
    opacity: 0;
    transform: translateX(-50%);
    transition-duration: .3s;
}

.actions-leave-active {
    opacity: 1;
    transform: translateX(0px);
    transition-duration: .1s;
    transition-delay: .6s;
}

.actions-enter-from {
    opacity: 0;
    transform: translateX(-50%);
}

.actions-enter-to {
    opacity: 1;
    transform: translateX(0px);
}

.actions-leave-from {
    opacity: 1;
    transform: translateX(0px);
}

.actions-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.userActionName {
    font-size: 2em;
    color: white;
    text-shadow: 0px 0px 20px var(--cor3);
    transform: translateX(0px);
    background: var(--background);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-stroke: .2em transparent;
    z-index: 4;
}

@media screen and (max-width: 870px) {
    .video-container-mobile {
        width: 100%;
        min-height: 200px;
        position: relative;
        height: 97vh;
        flex: 1.5;
    }

    #video {
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--chatOpacity);

    }
}

@media screen and (max-width: 500px) {
    .container-app {
        flex: 1;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        overflow: auto;
        position: relative;
    }

    .video-container-mobile {
        flex: 2;
        min-width: 360px;
        width: 100%;
    }

    .video-container-mobile #video {
        width: 100%;
        background-color: var(--chatOpacity);

    }

}
</style>