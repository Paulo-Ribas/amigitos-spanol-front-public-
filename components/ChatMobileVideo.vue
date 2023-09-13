<template>
    <div class="video-menu-container">
        <PoopBox @confirm="emitBan($event)" @refuse="banning = false"
            :msgProps="'tem certeza que quer mesmo banir o ' + memberChoiced.username + '?'" btnConfirmProps="Sim"
            btnRefuseProps="Não" :datesProps="memberChoiced" v-if="banning"></PoopBox>
        <PoopBox @confirm="emitAdm($event)" @refuse="givingAdm = false"
            :msgProps="'tem certeza que quer mesmo dar para o ' + memberChoiced.username + '?'" btnConfirmProps="Sim"
            btnRefuseProps="Depois" :datesProps="memberChoiced" v-if="givingAdm"></PoopBox>
        <div class="btn-container">
            <BtnSpecial @clicked="emitClick" btnProps="Escolher Video"></BtnSpecial>
        </div>
        <div class="info-users" @mouseover="removePopUpInfo">
            <div class="user-info" v-if="Object.keys(memberChoiced).length > 0">
                <fa icon="gears" class="icon-info-user" v-if="!settings" @click="settings = true"></fa>
            </div>
        </div>
        <div class="members-container">
            <div :class="{ members: 'members', width100 }">
                <div class="member" v-for="(member, index) in membersReactive" :key="index">
                    <div class="member-container" @click="showMemberInfo(index)">
                        <img :src="member.profileimg">
                    </div>
                </div>
            </div>
            <div class="icon-container" @click="width100 = !width100">
                <fa icon="users"></fa>
            </div>
        </div>
        <div class="options" v-if="settings">
            <fa class="close-options" icon="xmark" @click="closeOptions()"></fa>
            <h3 class="name-info"><a target="_blank" :href="'/users/' + memberChoiced.id">{{ memberChoiced.username }}</a>
            </h3>
            <ul @mouseleave="removePopUpInfo()">
                <!-- dono da sala -->
                <li v-if="memberChoiced.id === roomInfo.userAdm" @mouseenter="setPopUpInfo('dono')"
                    @mouseleave="removePopUpInfo()">
                    <fa class="icon-li" icon="chess-king"></fa>
                    <PopUpInfo textProps="você mesmo lol" v-if="popUpInfo === 'você mesmo lol'" />
                </li>
                <!---->
                <!--próprio user-->
                <!--                     <li v-if="memberChoiced.id === user.id" @mouseenter="setPopUpInfo('você mesmo lol')" @mouseleave="removePopUpInfo()"> <fa class="icon-li" icon="user-plus" @click="showFriendList = true"><PopUpInfo textProps="você mesmo lol" v-if="popUpInfo === 'você mesmo lol'"/></fa></li>
 --> <!-- -->
                <!-- remover da sala li's -->
                <li v-if="removeFromRoom" @mouseenter="setPopUpInfo('remover da sala')" @mouseleave="removePopUpInfo()">
                    <fa class="icon-li" icon="person-falling-burst" @click="emitKick(memberChoiced)" />
                    <PopUpInfo textProps="remover da sala" v-if="popUpInfo === 'remover da sala'" />
                </li>
                <!-- -->
                <!-- mutar usuario li's -->
                <li v-if="muteUser" @mouseleave="removePopUpInfo()">
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
                <li v-if="giveAdministrationToUser" @mouseenter="setPopUpInfo('ser admistrador')" @click="givingAdm = true"
                    @mouseleave="removePopUpInfo()">
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
        <div class="chatMembers-container">
            <div class="container-chat">
                <div class="chat-container">
                    <div class="chat-mobile-screen" @click="setScroll">
                        <div class="msg-container" v-for="(msgsMobile, index) in msgs" :key="index">
                            <div class="name-img-container">
                                <div class="img-container">
                                    <img :src="msg.userImg">
                                </div>
                                <span class="user-name-chat">{{ msg.userName }}</span>
                            </div>
                            <div class="msg-text">
                                <p v-html="msg.text" v-if="msg.emoji">
                                </p>
                                <p v-else>
                                    {{ msg.text }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="text-area-container">
                        <form class="btn-form">
                            <textarea v-show="msgErr === ''" id="textarea-mobile" @keydown="sendByEnter">
                                </textarea>
                            <div class="erro" v-show="msgErr != ''">
                                {{ msgErr }}
                            </div>
                            <input id="send" type="submit" value="Enviar" @click="sendMSG">
                        </form>
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
        console.log('e foi montado o celular')
        await this.JoinRoom()
        this.chatAttempts = 0
        this.msgsMobile.length === 0 && this.$props.chatProps.length === 0 ? this.askChat() : this.msgsMobile = this.$props.chatProps
        this.verifyEmptyMembers()

    },

    props: {
        chatProps: Array,
    },

    data() {
        return {
            room: this.$route.params.roomId,
            socket: null,
            msgsMobile: this.$props.chatProps,
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
        async roomInfo(value, payload) {
            await this.checkMuted()
            await this.checkAdm()
            await this.changeMembersValues()
            await this.attMemberChoiced()
        },
        chatProps(value, payload) {
            this.msgsMobile = value
            this.setScroll()
        }
    },
    beforeDestroy() {
        this.socket.disconnect()
    },
    methods: {
        connectionServer() {
            this.socket = io.connect('https://amigitos-espanol-api.com.br/', { rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling'] })
            this.socket.on('listMembersUpdate',async data => {
                await this.attRoom()
                this.updateMember(data)
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
        },
        async JoinRoom() {
            let validUser = this.validateUserDates()
            this.verifyEmptyMembers()
            if (validUser) {
                let room = this.room
                this.connectionServer()
                this.socket.emit('joinRoom', { user: this.user, room, chat: true })
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

            }, 3000);
        },
        ...mapActions({ getRoom: 'user/getRoom', validateUser: 'user/validateUser', setState: 'user/setState' }),
        async attRoom() {
            try {
                let roomInfo = await this.getRoom(this.room)
                this.roomInfo = roomInfo.room
                this.members = roomInfo.room.members
                this.membersReactive = roomInfo.room.members
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
        attMemberChoiced() {
            let member = this.membersReactive.find(member => this.memberChoiced.id === member.id)
            if (member) return this.memberChoiced = member
            else this.infoMembers = false
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

            this.msgsMobile.push(mensagem)
            this.setScroll(mensagem)

        },
        setScroll(msg) {
            let scroll = document.querySelector('.chat-screen')
            let lastMsg = this.msgsMobile[(this.msgsMobile.length - 1)]
            if ((scroll.scrollHeight - scroll.scrollTop) <= 400 && lastMsg.id != this.user.id) {
                setTimeout(() => {
                    scroll.scrollTop = scroll.scrollHeight
                }, 333);

            }

        },
        attChat(data) {
            this.verifyEmptyMembers()
            if (this.user.id === data.userRequest) {
                this.msgsMobile = data.chat
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

            if (this.msgsMobile.length === 0 && !data.empty) {
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
        async kickApply(member) {
            await this.attRoom()
            if (this.user.id != member.id) return

            this.$router.push('/room')
        },
        emitMute(member) {
            this.socket.emit('muteMember', { member: member, room: this.room })
        },
        async muteApply() {
            await this.attRoom()
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
        async unmuteApply(data) {
            await this.attRoom()
        },
        emitBan(member) {
            this.banning = false
            this.socket.emit('banMember', { member, room: this.room })

        },
        async banApply(data) {
            let member = data.member
            this.emitKick(member)
        },
        emitAllowChoiceVideos(member) {
            this.socket.emit('allowChoice', { member, room: this.room })
        },
        async applyAllowChoiceVideos(data) {
            await this.attRoom()


        },
        emitRemoveAllowedMemberChoice(member) {

            this.socket.emit('removeAllowedMemberChoice', { member, room: this.room })
        },
        async applyRemoveAllowedMemberChoice(data) {
            await this.attRoom()
        },
        emitAdm(member) {

            this.socket.emit('giveMemberAdm', { member: member, room: this.room })
            this.givingAdm = false

        },
        async applyAdm(data) {
            await this.attRoom()
        },
        emitRemoveMemberAdm(member) {

            this.socket.emit('removeMemberAdm', { member: member, room: this.room })
        },
        async applyRemoveMemberAdm(data) {
            await this.attRoom()
        }

    }

}
</script>

