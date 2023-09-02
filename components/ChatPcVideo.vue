<template>
    <div class="video-menu-container" @mouseover="removePopUpInfo" @mouseleave="removePopUpInfo">
        <PoopBox @confirm="emitBan($event)" @refuse="banning = false"
            :msgProps="'tem certeza que quer mesmo banir o ' + memberChoiced.username + '?'" btnConfirmProps="Sim"
            btnRefuseProps="Não" :datesProps="memberChoiced" v-if="banning"></PoopBox>
        <PoopBox @confirm="emitAdm($event)" @refuse="givingAdm = false"
            :msgProps="'tem certeza que quer mesmo dar para o ' + memberChoiced.username + '?'" btnConfirmProps="Sim"
            btnRefuseProps="Depois" :datesProps="memberChoiced" v-if="givingAdm"></PoopBox>
        <div class="friend-list" v-if="showFriendList">
            <fa icon="xmark" @click="showFriendList = false"></fa>
            <Friend-list btnProps="Convidar Amigo" @btnClicked="inviteFriend($event)"></Friend-list>
        </div>
        <div class="btn-container">
            <BtnSpecial @clicked="emitClick" btnProps="Escolher Video" @btnClicked="inviteFriend($event)"></BtnSpecial>
        </div>
        <div class="info-users" @mouseover="removePopUpInfo">
            <div class="user-info" v-if="Object.keys(memberChoiced).length > 0">
                <fa icon="gears" class="icon-info-user" @click="settings = !settings"></fa>
                <div class="img-name-container">
                    <img :src="memberChoiced.profileimg">
                </div>
            </div>
            <div class="options" v-if="settings">
                <fa class="close-options" icon="xmark" @click="settings = false"></fa>
                <h3 class="name-info"><a target="_blank" :href="'/users/' + memberChoiced.id">{{ memberChoiced.username }}</a>
                </h3>
                <ul @mouseleave="removePopUpInfo()">
                    <!-- dono da sala -->
                    <li v-if="memberChoiced.id === roomInfo.userAdm" @mouseenter="setPopUpInfo('dono')"
                        @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="chess-king"></fa>
                        <PopUpInfo textProps="dono" v-if="popUpInfo === 'dono'" />
                    </li>
                    <!---->
                    <!--próprio user-->
                    <!--                         <li v-if="memberChoiced.id === user.id" @mouseenter="setPopUpInfo('convidar amigos')" @mouseleave="removePopUpInfo()"> <fa class="icon-li" icon="user-plus" @click="showFriendList = true"><PopUpInfo textProps="convidar amigos" v-if="popUpInfo === 'convidar amigos'"/></fa></li>
 --> <!-- -->
                    <!-- remover da sala li's -->
                    <li v-if="removeFromRoom" @mouseenter="setPopUpInfo('remover da sala')" @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="person-falling-burst" @click="emitKick(memberChoiced)" />
                        <PopUpInfo textProps="remover da sala" v-if="popUpInfo === 'remover da sala'" />
                    </li>
                    <!-- -->
                    <!-- mutar usuario li's -->
                    <li v-if="muteUser" @mouseenter="setPopUpInfo('mutar usuário')" @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="comment-slash" @click="emitMute(memberChoiced)" />
                        <PopUpInfo textProps="mutar usuário" v-if="popUpInfo === 'mutar usuário'" />
                    </li>
                    <!-- -->
                    <!-- desmutar usuario li's -->
                    <li v-if="unmuteUser" @mouseenter="setPopUpInfo('desmutar usuário')" @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="comment" @click="emitUnmute(memberChoiced)"></fa>
                        <PopUpInfo textProps="desmutar usuário" v-if="popUpInfo === 'desmutar usuário'" />
                    </li>
                    <li v-if="communUser && memberChoiced.muted" @mouseenter="setPopUpInfo('usuário mutado')"
                        @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="comment-slash"></fa>
                        <PopUpInfo textProps="usuário mutado" v-if="popUpInfo === 'usuário mutado'" />
                    </li>
                    <!-- -->
                    <!-- banir usuario li-'s -->
                    <li v-if="banUser" @mouseenter="setPopUpInfo('banir')" @click="banning = true"
                        @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="hammer"></fa>
                        <PopUpInfo textProps="banir" v-if="popUpInfo === 'banir'" />
                    </li>
                    <!---->
                    <!-- permitir usuario escolher videos li's -->
                    <li v-if="allowUserToChooseVideos" @mouseenter="setPopUpInfo('permitir escolher vídeos')"
                        @click="emitAllowChoiceVideos(memberChoiced)" @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="film"></fa>
                        <PopUpInfo textProps="permitir escolher vídeos" v-if="popUpInfo === 'permitir escolher vídeos'" />
                    </li>
                    <li v-if="communUser && memberChoiced.choice" @mouseenter="setPopUpInfo('pode escolher videos')"
                        @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="film"></fa>
                        <PopUpInfo textProps="pode escolher videos" v-if="popUpInfo === 'pode escolher videos'" />
                    </li>
                    <!---->
                    <!-- remover permissão de usuario escolher videos li-->
                    <li v-if="removeUserPermissionToChooseVideos"
                        @mouseenter="setPopUpInfo('remover permissão de escolher videos')" @mouseleave="removePopUpInfo()"
                        @click="emitRemoveAllowedMemberChoice(memberChoiced)">
                        <fa class="icon-li" icon="clapperboard"></fa>
                        <PopUpInfo textProps="remover permissão de escolher videos"
                            v-if="popUpInfo === 'remover permissão de escolher videos'" />
                    </li>
                    <!---->
                    <!-- dar admistração a usuario li's -->
                    <li v-if="giveAdministrationToUser" @mouseenter="setPopUpInfo('ser admistrador')"
                        @click="givingAdm = true" @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="screwdriver-wrench"></fa>
                        <PopUpInfo textProps="ser admistrador" v-if="popUpInfo === 'ser admistrador'" />
                    </li>
                    <li v-if="memberChoiced.role && communUser" @mouseenter="setPopUpInfo('admistrador')"
                        @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="screwdriver-wrench"></fa>
                        <PopUpInfo textProps="admistrador" v-if="popUpInfo === 'admistrador'" />
                    </li>
                    <!---->
                    <!-- remover admistração de usuario li-->
                    <li v-if="removeAdministrationFromUser" @click="emitRemoveMemberAdm(memberChoiced)"
                        @mouseenter="setPopUpInfo('remover admistração')" @mouseleave="removePopUpInfo()">
                        <fa class="icon-li" icon="screwdriver"></fa>
                        <PopUpInfo textProps="remover admistração" v-if="popUpInfo === 'remover admistração'" />
                    </li>
                    <!---->
                </ul>
            </div>
        </div>
        <div class="chatMembers-container" @mouseenter="removePopUpInfo">
            <div class="container-chat" @mouseover="removePopUpInfo">
                <div class="members" @mouseover="removePopUpInfo">
                    <div class="member" v-for="(member, index) in membersReactive" :key="index">
                        <div class="member-container" @click="showMemberInfo(index)">
                            <img :src="member.profileimg">
                        </div>
                    </div>
                </div>
                <div class="chat-container" @mouseenter="removePopUpInfo">
                    <div class="chat-screen" @click="setScroll">
                        <div class="msg-container" v-for="(msg, index) in msgs" :key="index">
                            <div class="name-img-container">
                                <div class="img-container">
                                    <img :src="msg.userImg">
                                </div>
                                <span class="user-name-chat">{{ msg.userName }}</span>
                            </div>
                            <div class="msg-text" v-if="msg.id === user.id">
                                <p v-html="msg.text" v-if="msg.emoji">
                                </p>
                                <p v-else>
                                    {{ msg.text }}
                                </p>
                            </div>
                            <div class="msg-text flex-reverse" v-else>
                                <p v-html="msg.text" v-if="msg.emoji">
                                </p>
                                <p v-else>
                                    {{ msg.text }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div id="text-area-container">
                        <form class="btn-form" v-show="!muted">
                            <textarea id="textarealol" v-show="msgErr === ''" @keydown="sendByEnter">
                                </textarea>
                            <div class="erro" v-show="msgErr != ''">
                                {{ msgErr }}
                            </div>
                            <input id="send" type="submit" value="Enviar" @click="sendMSG">
                        </form>
                        <span v-if="muted" class="muted">você está mutado</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client'
import { mapState, mapActions } from 'vuex'
export default {
    async fetch() {
        try {
            await this.setState()
            return
        } catch (error) {
            throw error
        }
    },
    fetchOnServer: false,
    async mounted() {
        await this.JoinRoom()
        this.chatAttempts = 0
        this.askChat()
        this.verifyEmptyMembers()
        this.memberIsMembersInterval = setInterval(() => {
            if (this.$route.fullPath === `/watch/upload/${this.room}` || this.$route.fullPath === `/watch/youtube/${this.room}`) {
                this.checkIfMemberIsMember()
            }
        }, 6000);

    },
    data() {
        return {
            room: this.$route.params.roomId,
            socket: null,
            msgs: [],
            members: [],
            msgSent: 0,
            msgErr: '',
            infoMembers: false,
            memberChoiced: {},
            settings: false,
            roomInfo: undefined,
            popUpInfo: '',
            popUp: false,
            adm: false,
            muted: false,
            givingAdm: false,
            banning: false,
            attempts: 0,
            chatAttempts: 0,
            chatEmpty: false,
            showFriendList: false,
            memberIsMembersInterval: undefined,

        }
    },
    computed: {
        ...mapState({ user: state => state.user }),
        membersReactive() {
            return this.members

        },
        removeFromRoom() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isNotOwner = this.roomInfo.userAdm != this.memberChoiced.id
            let isAdm = this.adm
            let isDifferentUser = this.user.id != this.memberChoiced.id
            let userIsNotAdm = this.memberChoiced.role === 0

            return (isOwner && isDifferentUser) || (isAdm && isDifferentUser && isNotOwner && userIsNotAdm)
        },
        muteUser() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isNotOwner = this.roomInfo.userAdm != this.memberChoiced.id
            let isAdm = this.adm
            let isDifferentUser = this.user.id != this.memberChoiced.id
            let isMuted = this.memberChoiced.muted
            let userIsNotAdm = this.memberChoiced.role === 0

            return (isOwner && isDifferentUser && !isMuted) || (isAdm && isDifferentUser && isNotOwner && userIsNotAdm && !isMuted && userIsNotAdm)
        },
        unmuteUser() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isNotOwner = this.roomInfo.userAdm != this.memberChoiced.id
            let isAdm = this.adm
            let isDifferentUser = this.user.id != this.memberChoiced.id
            let isMuted = this.memberChoiced.muted
            let userIsNotAdm = this.memberChoiced.role === 0

            return (isOwner && isDifferentUser && isMuted) || (isAdm && isDifferentUser && isNotOwner && userIsNotAdm && isMuted && userIsNotAdm)
        },
        banUser() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isNotOwner = this.roomInfo.userAdm != this.memberChoiced.id
            let isAdm = this.adm
            let isDifferentUser = this.user.id != this.memberChoiced.id
            let userIsNotAdm = this.memberChoiced.role === 0

            return (isOwner && isDifferentUser) || (isAdm && isDifferentUser && isNotOwner && userIsNotAdm)
        },
        allowUserToChooseVideos() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isNotOwner = this.roomInfo.userAdm != this.memberChoiced.id
            let isAdm = this.adm
            let isDifferentUser = this.user.id != this.memberChoiced.id
            let userIsNotAdm = this.memberChoiced.role === 0
            let canChoice = this.memberChoiced.choice


            return (isOwner && isDifferentUser && !canChoice) || (isAdm && isDifferentUser && isNotOwner && userIsNotAdm && !canChoice)
        },
        removeUserPermissionToChooseVideos() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isNotOwner = this.roomInfo.userAdm != this.memberChoiced.id
            let isAdm = this.adm
            let isDifferentUser = this.user.id != this.memberChoiced.id
            let userIsNotAdm = this.memberChoiced.role === 0
            let canChoice = this.memberChoiced.choice

            return (isOwner && isDifferentUser && canChoice) || (isAdm && isDifferentUser && isNotOwner && userIsNotAdm && canChoice)

        },
        giveAdministrationToUser() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isNotOwner = this.roomInfo.userAdm != this.memberChoiced.id
            let isAdm = this.adm
            let isDifferentUser = this.user.id != this.memberChoiced.id
            let userIsNotAdm = this.memberChoiced.role === 0




            return (isOwner && isDifferentUser && userIsNotAdm)

        },
        removeAdministrationFromUser() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isNotOwner = this.roomInfo.userAdm != this.memberChoiced.id
            let isAdm = this.adm
            let isDifferentUser = this.user.id != this.memberChoiced.id
            let userIsNotAdm = this.memberChoiced.role === 0


            return (isOwner && isDifferentUser && !userIsNotAdm)

        },
        communUser() {
            let isOwner = this.user.id === this.roomInfo.userAdm
            let isAdm = this.adm

            return !isOwner
        },
        owner() {
            return this.user.id === this.roomInfo.userAdm
        }
    },
    watch: {
        roomInfo(value, payload) {
            this.checkMuted()
            this.checkAdm()
            this.changeMembersValues()
            this.checkIfMemberIsMember()
        }
    },
    beforeDestroy() {
        clearInterval(this.memberIsMembersInterval)
        this.socket.disconnect()
    },
    methods: {
        connectionServer() {
            this.socket = io.connect('http://localhost:3333/')
            this.socket.on('msg', data => {
                this.renderMSG(data)
            })
            this.socket.on('listMembersUpdate', data => {

                this.updateMember(data)
                this.attRoom()
            })
            this.socket.on('requestMsg', data => {
                this.sendChat(data)
            })
            this.socket.on('chatRecived', data => {
                this.attChat(data)
            })
            this.socket.on('attRoomInfo', data => {
                this.attRoom()
            });
            this.socket.on('kickApply', data => {
                this.kickApply(data)
            })
            this.socket.on('muteApply', data => {
                this.muteApply(data)
            })
            this.socket.on('unmuteApply', data => {
                this.unmuteApply(data)
            })
            this.socket.on('banApply', data => {
                this.banApply(data)
            })
            this.socket.on('applyAllowChoiceVideos', data => {
                this.applyAllowChoiceVideos(data)
            })
            this.socket.on('applyRemoveAllowedMemberChoice', data => {

                this.applyRemoveAllowedMemberChoice(data)
            })
            this.socket.on('applyAdm', data => {
                this.applyAdm(data)
            })
            this.socket.on('applyRemoveAdm', data => {
                this.applyRemoveMemberAdm(data)
            })
            this.socket.on('secondMemberSendChat', data => {
                this.chatAttemptTwo(data)
            })
        },
        async JoinRoom() {
            let validUser = this.validateUserDates()
            this.verifyEmptyMembers()
            if (validUser) {
                let room = this.room
                this.connectionServer()
                this.socket.emit('joinRoom', { user: this.user, room })
                await this.awaitUserJoinConfirm()

                return
            }
            else {
                setTimeout(() => {
                    if (this.attempts <= 3) {
                        this.JoinRoom()
                    }
                    else {
                        this.$router.push('/room')
                    }
                }, 300);
            }

        },
        awaitUserJoinConfirm() {
            return new Promise((resolve, reject) => {
                this.socket.on('userJoinConfirmed', data => {

                    return resolve()
                })
            })
        },
        verifyEmptyMembers() {
            setTimeout(async () => {
                if (!this.roomInfo.members || this.roomInfo.members.length === 0) {
                    let room = await this.getRoom(this.room)
                    this.roomInfo = room.room
                }

            }, 1000);
        },
        ...mapActions({ getRoom: 'user/getRoom', validateUser: 'user/validateUser', setState: 'user/setState' }),
        async attRoom() {

            try {
                let roomInfo = await this.getRoom(this.room)
                this.roomInfo = roomInfo.room
                this.members = roomInfo.room.members
            } catch (error) {
                this.err = error
                throw error
            }
        },
        validateUserDates() {
            let token = this.$cookies.get('token')
            if (!this.user.id) {
                this.validateUser(token)
                return false
            }
            return true
        },
        askChat() {

            if (!this.socket) return
            this.socket.emit('requestForChatMsgs', { user: this.user.id, room: this.room })
        },
        showMemberInfo(index) {
            this.infoMembers = true
            this.memberChoiced = this.membersReactive[index]

        },
        checkAdm() {
            let isAdm = this.roomInfo.adms.find(users => {
                return users.id === this.user.id
            })
            isAdm ? this.adm = true : this.adm = this.adm
        },
        changeMembersValues() {
            if (!this.membersReactive) return
            for (let i = 0; i < this.membersReactive.length; i++) {

                let user = this.membersReactive[i]
                let muted = this.roomInfo.isMuted.find(member => {
                    return member.id === user.id
                })
                let adm = this.roomInfo.adms.find(member => {
                    let count = 0

                    return member.id === user.id
                })
                let canChoice = this.roomInfo.membersAllowedChoice.find(member => {
                    return member.id === user.id
                })
                if (muted) this.membersReactive[i].muted = true
                else this.membersReactive[i].muted = false

                if (adm) {
                    this.$set(this.membersReactive[i], 'role', 1)
                    this.membersReactive[i].role = 1

                }
                else this.membersReactive[i].role = 0

                if (canChoice) this.membersReactive[i].choice = true
                else this.membersReactive[i].choice = false

            }
        },
        async checkIfMemberIsMember() {
            await this.attRoom()
            let user = this.membersReactive.find(member => {
                return member.id === this.user.id

            })
            if (user) return
            this.$router.push('/room')
        },
        async emitMsg() {
            let msg = document.querySelector('textarea')
            let msgValue = msg.value
            let dates = {
                userName: this.user.userName,
                userImg: this.user.profileimg,
                userId: this.user.id,
                room: this.room,
                text: msgValue
            }
            try {
                await this.verifySpam()
                await this.verifyMsgSize()
                msg.value = null
                this.socket.emit('newMSG', dates)
                let scroll = document.querySelector('.chat-screen')
                setTimeout(() => {
                    scroll.scrollTop = scroll.scrollHeight
                }, 200);

            } catch (error) {
                return
            }
        },
        sendMSG(e) {
            e.preventDefault()
            this.emitMsg()
        },
        sendByEnter(key) {
            if (key.code === "Enter" && !key.shiftKey) {
                key.preventDefault()
                this.emitMsg()
            }
        },
        verifySpam() {
            this.msgSent++

            return new Promise((resolve, reject) => {
                if (this.msgSent < 7) {
                    return resolve()
                }
                if (this.msgSent === 7) {
                    setTimeout(() => {
                        this.msgSent = 0
                        this.msgErr = ''
                    }, 4000);
                    return resolve()
                }
                if (this.msgSent > 9) {
                    this.msgErr = 'está enviando mensagens em um intervalo muito curto'
                    return reject()
                }
            })
        },
        verifyMsgSize() {
            let msg = document.querySelector('textarea')
            let msgValue = msg.value.split('')
            return new Promise((resolve, reject) => {
                if (msgValue.length >= 1500) {
                    this.msgErr = "muito texto"
                    setTimeout(() => {
                        this.msgErr = ''
                    }, 3000);
                    return reject()
                }
                else {
                    return resolve()
                }
            })
        },
        renderMSG(msg) {
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

            this.msgs.push(mensagem)
            this.setScroll(mensagem)

        },
        setScroll(msg) {
            let scroll = document.querySelector('.chat-screen')
            let user = msg.id

            if ((scroll.scrollHeight - scroll.scrollTop) <= 260 && user != this.user.id) {
                setTimeout(() => {
                    scroll.scrollTop = scroll.scrollHeight
                }, 100);

            }

        },
        sendChat(data) {
            let userRequest = data.user
            let room = this.room
            let chat = this.msgs
            let chatEmpty = false
            let newUserThatSendTheChat = undefined
            if (chat.length === 0) {
                chatEmpty = true
            }
            if (this.members[0].id != this.user.id) return
            if (this.members[0].id === userRequest && this.members.length < 2) return
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
            let chat = this.msgs
            let chatEmpty = false
            if (this.user.id != whoSentChat) return
            if (chat.length === 0) {
                chatEmpty = true
            }
            if (chatEmpty) return this.socket.emit('chatSent', { userRequest, room, chat, empty: true })
            if (!chatEmpty) return this.socket.emit('chatSent', { userRequest, room, chat, empty: false })


        },
        attChat(data) {
            this.verifyEmptyMembers()
            if (this.user.id === data.userRequest) {
                this.msgs = data.chat
                let empty = this.verifyChatEmpty(data)
                if (empty && this.chatAttempts < 2 && !this.chatEmpty) {

                    setTimeout(() => {
                        this.askChat()
                    }, 2000);
                }

                else {
                    this.setScroll()
                }
            }
        },
        verifyChatEmpty(data) {

            this.chatAttempts++

            if (this.msgs.length === 0 && !data.empty) {
                return true
            }
            if (data.empty) {
                this.chatEmpty = true
                return true
            }
            else {
                this.chatEmpty = false
                return false
            }
        },
        setPopUpInfo(popUp) {
            setTimeout(() => {
                this.popUpInfo = popUp
            }, 400);
        },
        removePopUpInfo() {
            this.popUpInfo = ''
        },
        updateMember(member) {
            this.members = member
            let user = this.members.find(member => {
                member.id === this.memberChoiced.id
            })
            if (!user) {
                this.memberChoiced = {}
                this.settings = false
            }
        },
        inviteFriend(userId) {
            let dates = {
                userId: userId,
                roomInfo: roomInfo
            }
            this.socket.emit('roomNotification', dates)
        },
        emitClick() {
            this.$emit('clicked')
        },
        emitKick(member) {
            this.socket.emit('kickMember', { member, room: this.room })
        },
        kickApply(member) {

            if (this.user.id != member.id) return

            this.$router.push('/room')
        },
        emitMute(member) {
            this.socket.emit('muteMember', { member: member, room: this.room })
        },
        muteApply(room) {

            this.roomInfo = room
        },
        checkMuted() {

            let isMuted = this.roomInfo.isMuted.find(users => {
                return users.id === this.user.id
            })
            isMuted ? this.muted = true : this.muted = false
        },
        emitUnmute(member) {
            this.socket.emit('unmuteMember', { member, room: this.room })
        },
        unmuteApply(data) {
            this.roomInfo = data.room
        },
        emitBan(member) {

            this.banning = false
            this.socket.emit('banMember', { member, room: this.room })

        },
        banApply(data) {
            this.roomInfo = data.room
            let member = data.member

            this.emitKick(member)
        },
        emitAllowChoiceVideos(member) {
            this.socket.emit('allowChoice', { member, room: this.room })
        },
        applyAllowChoiceVideos(data) {
            this.roomInfo = data.room


        },
        emitRemoveAllowedMemberChoice(member) {

            this.socket.emit('removeAllowedMemberChoice', { member, room: this.room })
        },
        applyRemoveAllowedMemberChoice(data) {
            this.roomInfo = data.room
        },
        emitAdm(member) {

            this.socket.emit('giveMemberAdm', { member: member, room: this.room })
            this.givingAdm = false

        },
        applyAdm(data) {
            this.roomInfo = data.room
        },
        emitRemoveMemberAdm(member) {

            this.socket.emit('removeMemberAdm', { member: member, room: this.room })
        },
        applyRemoveMemberAdm(data) {

            this.roomInfo = data.room
        }

    }

}
</script>

<style scoped>
.video-menu-container {
    background-color: var(--corMenu);
    flex: 0.229;
    max-width: 300px;
    min-width: 210px;
    height: 75vh;
    max-height: 480px;
    margin: 10px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}

.info-users {
    flex: 1;
    display: flex;
    position: relative;
}

.icon-info-user {
    position: absolute;
    z-index: 2;
    color: var(--cor4);
    font-size: 1.9em;
    right: 0;
    margin-right: 8px;
    cursor: pointer;
}

.user-info {
    position: relative;
    flex: 1;
}

.img-name-container {
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;

}

.img-name-container img {
    width: 100%;
    height: 100%;
    position: absolute;
    object-fit: cover;
    object-position: 0px -16px;
}

.btn-container {
    margin: 10px 5px;
    overflow: hidden;
    border-radius: 5px;
}

.chatMembers-container {
    height: 308px;
}

.container-chat {
    height: 100%;
    background-color: var(--corMenu);

}

.erro-container {
    position: absolute;
    bottom: -5%;
    min-width: 220px;
    width: 310px;
}

.member {
    position: relative;
}

.flex-reverse {
    flex-direction: row-reverse;
}

.members {
    height: 63px;
    width: 100%;
    overflow-x: auto;
    display: flex;
    overflow-x: auto;
    overflow-y: none;
}

.member-container {
    height: 50px;
    width: 50px;
    position: relative;
    margin: 0px 5px;
}

.member-container img {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 20px;
    cursor: pointer;
    object-fit: cover;
}

.options {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--cor7);
    border-radius: 2px;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.options h3,
a {
    color: var(--cor8);
    font-family: cursive;
    text-decoration: none;
    font-size: 1.3em;
    text-align: center;
    margin-top: 4px;
}

.options ul {
    display: flex;
    width: 100%;
    height: 35%;
    max-height: 50px;
    min-height: 30px;
    background-color: var(--cor8);
}

.options ul li {
    flex: 1;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6em;
    border-right: 1.5px solid var(--cor6);
    border-left: 1.5px solid var(--cor6);
    cursor: pointer;
    transition: 0.2s;
    position: relative;
}

.options ul li .icon-li {
    color: var(--cor7);
    transition: 0.2s;
}

/* .options ul li:hover{
        background-color: var(--cor7); 
    } */
.options ul li:hover>.icon-li {
    transform: translateY(-2px);
    /*color: var(--cor8);*/
}

.close-options {
    color: var(--cor4);
    font-size: 1.3em;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-6px, 4px);
    z-index: 3;
    cursor: pointer;
}

.close-options:hover {
    color: var(--cor9);
    font-size: 1.3em;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-6px, 4px);
    z-index: 3;
    cursor: pointer;
    transition: 0.2s;

}

.erro {
    color: white;
    width: calc(100% - 30px);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: cursive;
    height: 45px;
}

.chat-container {
    height: calc(100% - 50px);
}

.chat-screen {
    width: 100%;
    height: calc(100% - 58px);
    overflow-y: auto;
}

#text-area-container {
    position: relative;
    height: 45px;
    background-color: var(--cor4);
}

.btn-form {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#textarealol {
    width: calc(100% - 30px);
    height: 99%;
    font-family: cursive;
    padding: 3px 5px;
    resize: none;
    border: 1px solid var(--cor7);
    outline: none;
    overflow-x: none;
}

.msg-container {
    width: fit-content;
    margin: 5px 0px;
    padding: 0px 5px;
}

.name-img-container {
    display: flex;
    max-width: 200px;
    overflow: hidden;
}

.img-container {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color: var(--cor4);
    border-bottom-left-radius: 0px;
    position: relative;
}

.img-container img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    object-fit: cover;
}

.user-name-chat {
    color: var(--cor6);
    font-family: cursive;
    font-size: 1.1em;
    margin-left: 11px;
    text-overflow: ellipsis;
}

.msg-text {
    font-family: cursive;
    color: white;
    background-color: var(--cor4);
    padding: 8px 10px;
    width: fit-content;
    min-width: 80px;
    border-radius: 29px;
    border-top-left-radius: 0px;
    word-break: break-word;
}

#send {
    background-color: var(--background);
    padding: 10px 10px;
    color: var(--cor7);
    border-radius: 24px;
}

.muted {
    text-align: center;
    color: var(--cor9);
    font-size: 1em;
    font-family: cursive;
    text-shadow: 0px 0px 2px var(--cor7), 0px 0px 2px var(--cor7), 0px 0px 2px var(--cor7);
    margin: 10px 0px 0px 10px;
    display: inline-block;
}

.friend-list {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
    background-color: var(--corMenu);
    padding: 10px;
    display: flex;

}</style>
