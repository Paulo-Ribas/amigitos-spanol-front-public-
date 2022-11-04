<template>
        <div class="video-menu-container">
            <div class="btn-container">
                <ButtonSpecial @clicked="emitClick" btnProps="Escolher Video"/>
            </div>
            <div class="members-container">
                <div :class="{members: 'members', width100}">
                    <div class="member" v-for="(member, index) in membersReactive" :key="index">
                        <div class="member-container">
                            <img  :src="member.profileimg">
                        </div>
                    </div>
                </div>
                <div class="icon-container" @click="width100 = !width100">
                    <fa icon="users"></fa>
                </div>
            </div>
            <div class="chatMembers-container">
                <div class="container-chat">
                    <div class="chat-container">
                        <div class="chat-screen" @click="setScroll">
                            <div class="msg-container" v-for="(msg , index) in msgs" :key="index">
                                <div class="name-img-container">
                                    <div class="img-container">
                                        <img :src="msg.userImg">
                                    </div>
                                    <span class="user-name-chat">{{msg.userName}}</span>
                                </div>
                                <div class="msg-text">
                                    <p v-html="msg.text" v-if="msg.emoji">
                                    </p>
                                    <p v-else>
                                        {{msg.text}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="text-area-container">
                            <form class="btn-form">
                                <textarea v-show="msgErr === ''" class="textarealol" @keydown="sendByEnter">
                                </textarea>
                                <div class="erro" v-show="msgErr != ''">
                                    {{msgErr}}
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
import {mapState} from 'vuex'
export default {
      fetch(){
        console.log('tokennnnnnnnn', this.$cookies.get('token'))
         this.$store.dispatch('user/validateUser', this.$cookies.get('token')).then(res => {
            this.$store.commit('user/SET_USER_INFO', res)
            console.log('agr virou promise com then', res)
         }).catch(err => {
            console.log('console do erro por virar primisse com then', err)
         })
    },
    fetchOnServer: false,
    beforeMount(){
        this.connectionServer()
    },
    mounted(){
        this.JoinRoom(),
        this.askChat()
        if (this.members.length === 0) {
            this.requestMembers()
        }
    },
        data(){
            return {
                room: this.$route.params.roomId,
                socket: null,
                msgs: [],
                members: [],
                membersReactive: [],
                msgSent: 0,
                msgErr: '',
                width100: false,
    
            }
        },
    computed:{
        ...mapState({user: state => state.user}),
    },
    watch: {
       members(value, payload){
        console.log(value)
        this.membersReactive = value
       },
       user(value, payload){
        console.log(value,'mudou')
        this.JoinRoom()
       }
    },
    methods:{
        connectionServer(){
           this.socket = io.connect('http://localhost:3333/')
           this.socket.on('msg', data => {
            this.renderMSG(data)
           })
           this.socket.on('listMembersUpdate', data => {
            console.log('entrou', data)
            this.updateMember(data)
           })
           this.socket.on('requestMsg', data => {
            this.sendChat(data)
           })
           this.socket.on('chatRecived', data => {
            this.attChat(data)
           })
           this.socket.on('membersSent', data => {
            this.updateMember(data)
            
           })
        },
         JoinRoom(){
            let user = this.user
            console.log(this.user, 'user do join room')
            let room = this.room
            this.socket.emit('joinRoom',{user,room})
        },
        askChat(){
            this.socket.emit('requestForChatMsgs', {user: this.user.id, room: this.room})
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
                 }, 100);

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
            console.log(this.msgSent)
            return new Promise((resolve, reject) => {  
                if (this.msgSent < 7) {
                    return resolve()             
                }
                if (this.msgSent === 7) {
                    setTimeout(() => {
                        this.msgSent = 0
                        this.msgErr = ''
                    }, 5000);
                    return resolve()
                    }
                if (this.msgSent > 8) {
                    this.msgErr = 'está enviando mensagens em um intervalo muito curto'
                    return reject()
                }
            })
        },
        verifyMsgSize(){
            let msg = document.querySelector('textarea')
            let msgValue = msg.value.split('')
            return new Promise((resolve, reject) => {
                if (msgValue.length >= 3000) {
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
                console.log(emojiVerify, 'meoju')
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
          this.setScroll(msg)
        },
        sendChat(data){
            let userRequest = data.user
            let room = this.room
            let chat = this.msgs
            this.socket.emit('chatSent', {userRequest, room, chat})
        },
        attChat(data){
            if (this.user.id === data.userRequest && this.msgs.length != data.chat.length) {
                setTimeout(() => {
                    this.msgs = data.chat
                }, 100);
            }
        },
        setScroll(msg){
            let scroll = document.querySelector('.chat-screen')
            let user = msg.userId
            console.log(scroll.scrollHeight, scroll.scrollTop, (scroll.scrollHeight - scroll.scrollTop))
            if((scroll.scrollHeight - scroll.scrollTop) <= 260 && user != this.user.id) {
                setTimeout(() => {
                    scroll.scrollTop = scroll.scrollHeight
                }, 100);

            }
            
        },
        requestMembers(){
            this.socket.emit('requestForMembers', {room: this.room, user: this.user.id})
        },
        updateMember(member){
            console.log('o update member', member)
            if (this.user.id === member.userId) {
                this.members = member.members
            }
        },
        teste(){
            console.log('teste lol')
        },
        emitClick(){
            this.$emit('clicked')
        }
    }
    
}
</script>

<style scoped>
    .video-menu-container{
        background-color:var(--corMenu);
        flex: 1.5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        width: 100%;
        margin-top: 10px;
        max-width: 400px;
    }
    .btn-container{
        margin: 10px 5px;
        overflow: hidden;
        border-radius: 5px;
    }
    .chatMembers-container {
        height: 340px
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
    .width100 {
        opacity: 1;
        width: 82% !important;
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
    .members-container {
        height: 58px;
        width: 100%;
        overflow-x: auto;
        display: flex;
        overflow-x: auto;
        overflow-y: none;
        align-items: center;
        position: absolute;
        transform: translateY(50px);
        flex-direction: row-reverse;
        z-index: 3;
    }
    .members-container .icon-container {
        color: white;
        background: var(--background);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;
        font-size: 1.4em;
    }
    .members {
        width: 0%;
        right: 0%;
        height: 100%;
        display: flex;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        margin-left: 5px;
        transition: width 1s;
        background-color: var(--corMenu);
        border: 1px solid var(--cor5);
        border-right: none;

    }
    .member-container {
        height: 49px;
        width: 49px;
        position: relative;
        margin: 0px 5px;
        position: absolute;
    }
    .member-container img {
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 20px;
        cursor: pointer;
    }
    .options {
        position: absolute;
        width: 80px;
        height: 80px;
        background-color: white;
        border-radius: 6px;
        z-index: 2;
    }
    .options ul {
        width: 100%;
        height: 100%;
        position: absolute;
    }
    .chat-container {
        height: 100%;
    }
    .chat-screen {
        width: 100%;
        height: calc(100% - 45px);
        overflow-y: auto;
    }
    .text-area-container {
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
    .textarealol {
        width: calc(100% - 30px);
        height: 99%;
        font-family: cursive;
        padding: 3px 5px;
        resize: none;
        border: 1px solid var(--cor7);
        outline: none
    }
    .msg-container {
        width: fit-content;
        margin: 5px 0px;
        padding: 0px 5px;
    }
    .name-img-container {
        display: flex;
        max-width: 200px;
    }
    .img-container{
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background-color: var(--cor4);
        border-bottom-left-radius: 0px;
        position: relative;
    }
      .img-container img{
        width: 34px;
        height: 34px;
        border-radius: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
    }
    .user-name-chat {
        color: var(--cor6);
        font-family: cursive;
        font-size: 1.1em;
        margin-left: 11px;
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

</style>