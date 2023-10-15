<template>
        <div class="video-menu-container" @mouseover="removePopUpInfo" @mouseleave="removePopUpInfo">
            <div class="chatMembers-container" @mouseenter="removePopUpInfo">
                <div class="container-chat" @mouseover="removePopUpInfo">
                    <div class="members" @mouseover="removePopUpInfo">
                        <div class="member" v-for="(member, index) in membersReactive" :key="index">
                            <div class="member-container" @click="showMemberInfo(index)">
                                <img  :src="member.profileimg">
                            </div>
                        </div>
                    </div>
                    <div class="chat-container" @mouseenter="removePopUpInfo">
                        <div class="chat-full-screen" @click="setScroll">
                            <div class="msg-container" v-for="(msg , index) in msgs" :key="index">
                                <div class="name-img-container">
                                    <div class="img-container">
                                        <img :src="msg.userImg">
                                    </div>
                                    <span class="user-name-chat">{{msg.userName}}</span>
                                </div>
                                <div class="msg-text" v-if="msg.id === user.id">
                                    <p v-html="msg.text" v-if="msg.emoji">
                                    </p>
                                    <p v-else>
                                        {{msg.text}}
                                    </p>
                                </div>
                                <div class="msg-text flex-reverse" v-else>
                                    <p v-html="msg.text" v-if="msg.emoji">
                                    </p>
                                    <p v-else>
                                        {{msg.text}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import io from 'socket.io-client'
import {mapState, mapActions} from 'vuex'
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
    async mounted(){
        await this.JoinRoom()
        this.chatAttempts = 0
        this.msgs.length === 0 && this.$props.chatProps.length === 0 ? this.askChat() : this.msgs = this.$props.chatProps
        this.verifyEmptyMembers()

       
    },
    beforeDestroy() {
      
        this.socket.disconnect()
    },
    props: {
        chatProps: Array,
    },
        data(){
            return {
                room: this.$route.params.roomId,
                socket: null,
                msgs: this.$props.chatProps,
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
               
    
            }
        },
    computed:{
        ...mapState({user: state => state.user}),
        membersReactive(){
            return this.members

        },
    },
    watch: {
        roomInfo(value, payload){
            this.checkMuted()
            this.checkAdm()
           
        },
        chatProps(value, payload){
            this.msgs = value
            this.setScroll()
        },
    },
    methods:{
        connectionServer(){
           this.socket = io.connect('https://www.amigitos-espanol-api.com.br/', { rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling'] })
           this.socket.on('listMembersUpdate', data => {
             
            this.updateMember(data)
            this.attRoom()
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
           this.socket.on('applyAllowChoiceVideos', data=> {
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
         async JoinRoom(){            
            let validUser = this.validateUserDates()
            this.verifyEmptyMembers()
            if (validUser) {
                let room = this.room
                this.connectionServer()
                this.socket.emit('joinRoom',{user: this.user,room, chat: true})
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
        awaitUserJoinConfirm(){
            return new Promise((resolve, reject) => {
                this.socket.on('userJoinConfirmed', data => {
                     
                    return resolve()
                })
            })
        },
        verifyEmptyMembers(){
            setTimeout( async () => {
                if(!this.roomInfo.members || this.roomInfo.members.length === 0) {
                    let room = await this.getRoom(this.room)
                    this.roomInfo = room.room
                }
                
            }, 1000);
        },
        ...mapActions({ getRoom: 'user/getRoom', validateUser: 'user/validateUser', setState: 'user/setState' }),
        async attRoom(){
             
            try {
                let roomInfo =  await this.getRoom(this.room)
                this.roomInfo = roomInfo.room
            } catch (error) {
                this.err  = error
                throw error
            }
        },
        validateUserDates(){
            let token = this.$cookies.get('token')
            if (!this.user.id) {
                this.validateUser(token)
                return false
            }
            return true
        },
        askChat(){
             
            if(!this.socket) return
            this.socket.emit('requestForChatMsgs', {user: this.user.id, room: this.room})
        },
        showMemberInfo(index){
            this.infoMembers = true
            this.memberChoiced = this.membersReactive[index]
             
        },
        checkAdm(){
            let isAdm = this.roomInfo.adms.find(users => {
                return users.id === this.user.id
            })
            isAdm ? this.adm = true : this.adm = this.adm
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
                let scroll = document.querySelector('.chat-full-screen')
                setTimeout(() => {
                    scroll.scrollTop = scroll.scrollHeight
                 }, 200);

            } catch (error) {
                return
            }
        },
        sendMSG(e){
            e.preventDefault()
            this.emitMsg()
        },
        sendByEnter(key) {
            if (key.code === "Enter" && !key.shiftKey) {
                key.preventDefault()
                this.emitMsg()
            }
        },
        verifySpam(){
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
        verifyMsgSize(){
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
            if (emojiVerify[0]==="(-emoji#)") {
                emoji = true
                 
                let newMsgFormat = emojiVerify[1]
                msgText = newMsgFormat
            }
            let mensagem = {
                userName: msg.userName,
                userImg: msg.userImg,
                text:msgText,
                emoji: emoji,
                id: msg.userId
            }
             
           this.msgs.push(mensagem)
           this.setScroll(mensagem)
          
        },
        setScroll() {
            let scroll = document.querySelector('.chat-mobile-screen') ||  document.querySelector('.chat-screen')
            let lastMsg = this.msgs[(this.msgs.length - 1)]
            if ((scroll.scrollHeight - scroll.scrollTop) <= 300) {
                setTimeout(() => {
                    scroll.scrollTop = scroll.scrollHeight
                }, 333);

            }

        },
        attChat(data){
            if (this.user.id === data.userRequest) {
                this.msgs = data.chat
                let empty = this.verifyChatEmpty(data)
                if(empty && this.chatAttempts < 1 && !this.chatEmpty) return this.askChat()
                else {
                this.setScroll()
                }
            }
        },
        verifyChatEmpty(data){
             
            this.chatAttempts++
            if (this.msgs.length === 0 && !data.empty) {
                return true
            }
            if(data.empty) {
                this.chatEmpty = true
                return true
            }
            else {
                this.chatEmpty = false
                return false
            }
        },
        removePopUpInfo(){
            this.popUpInfo = ''
        },
        updateMember(member){
            this.members = member
        },
        emitClick(){
            this.$emit('clicked')
        },
        emitKick(member){
            this.socket.emit('kickMember', {member, room: this.room})
        },
        kickApply(member){
             
            if (this.user.id != member.id) return
             
            this.$router.push('/room') 
        },
        emitMute(member){
            this.socket.emit('muteMember', {member:member, room: this.room})
        },
        muteApply(room){
             
            this.roomInfo = room
        },
        checkMuted(){
             
            let isMuted = this.roomInfo.isMuted.find(users => {
                return users.id === this.user.id
            })
            isMuted ? this.muted = true : this.muted = false
        },
        emitUnmute(member){
            this.socket.emit('unmuteMember', {member, room: this.room})
        },
        unmuteApply(data){
            this.roomInfo = data.room
        },
        emitBan(member){
             
            this.banning = false
            this.socket.emit('banMember', {member, room: this.room})

        },
        banApply(data){
            this.roomInfo = data.room
            let member = data.member
             
            this.emitKick(member)
        },
        emitAllowChoiceVideos(member){
            this.socket.emit('allowChoice', {member, room: this.room})
        },
        applyAllowChoiceVideos(data){
            this.roomInfo = data.room
             
            
        },
        emitRemoveAllowedMemberChoice(member){
             
            this.socket.emit('removeAllowedMemberChoice', {member, room: this.room})
        },
        applyRemoveAllowedMemberChoice(data){
            this.roomInfo = data.room
        },
        emitAdm(member){
            this.socket.emit('giveMemberAdm', {member:member, room: this.room})
            this.givingAdm = false

        },
        applyAdm(data){
            this.roomInfo = data.room
        },
        emitRemoveMemberAdm(member){
             
            this.socket.emit('removeMemberAdm', {member:member, room: this.room})
        },
        applyRemoveMemberAdm(data){
             
            this.roomInfo = data.room
        }

    }
    
}
</script>

<style scoped>
    .video-menu-container{
        max-width: 350px;
        min-width: 210px;
        width: 80%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        right: 0;
    }
    .info-users {
        flex: 1;
        display: flex;
        position: relative;
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
        opacity: 0.6;
    }
    
    .btn-container{
        margin: 10px 5px;
        overflow: hidden;
        border-radius: 5px;
    }
    .chatMembers-container {
        height: 100%;
    }
    .container-chat {
        height: 100%;
        background-color: var(--chatOpacity);
        padding: 0px 5px;
        
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
        opacity: 0.6;
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
    .chat-full-screen {
        width: 100%;
        height: calc(100% - 58px);
        overflow-y: auto;
    }
    .name-img-container {
        display: flex;
        max-width: 200px;
    }
    .img-container{
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background-color: var(--chatOpacity);
        border-bottom-left-radius: 0px;
        position: relative;
    }
      .img-container img{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        object-fit: cover;
        opacity: 0.4;
    }
    .user-name-chat {
        color: var(--cor6);
        font-family: cursive;
        font-size: 1.1em;
        margin-left: 11px;
        opacity: 0.6;
    }
    .msg-text {
        font-family: cursive;
        color: white;
        background-color: var(--chatOpacity);
        padding: 8px 10px;
        width: fit-content;
        min-width: 80px;
        border-radius: 29px;
        border-top-left-radius: 0px;
        word-break: break-word;
        
    }
    .msg-text  p{
        opacity: 0.6;
    }

</style>
