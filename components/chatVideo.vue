<template>
        <div class="video-menu-container">
            <div class="btn-container">
                <ButtonSpecial @clicked="emitClick" btnProps="Escolher Video"/>
            </div>
            <div class="chatMembers-container">
                <div class="container-chat">
                    <div class="members">
                        <div class="member" v-for="(member, index) in membersReactive" :key="index">
                            <div class="member-container">
                                <img  :src="member.profileimg">
                            <!-- <div class="options">
                                <ul>
                                    <li> <nuxt-link :to="'/users/' + user.id">Perfil</nuxt-link></li>
                                    <li v-if="user.id === room.userAdm">Remover Da Sala</li>
                                    <li v-if="user.id === room.userAdm">Mutar</li>
                                    <li v-if="user.id === room.userAdm">Banir</li>
                                    <li v-if="user.id === room.userAdm">Permitir Escolher Videos</li>
                                </ul>
                            </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="chat-container">
                        <div class="chat-screen" @click="setScroll">
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
                        <div class="text-area-container">
                            <form class="btn-form">
                                <textarea class="textarealol" v-show="msgErr === ''" @keydown="sendByEnter">
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
    mounted(){
        this.JoinRoom()
        this.askChat()
    },
        data(){
            return {
                room: this.$route.params.roomId,
                socket: null,
                msgs: [],
                members: [],
                msgSent: 0,
                msgErr: '',
    
            }
        },
    computed:{
        ...mapState({user: state => state.user}),
        membersReactive(){
            return this.members

        }
    },
    methods:{
        connectionServer(){
           this.socket = io.connect('https://amigitos-espanol-api.com.br/')
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
        },
         JoinRoom(){
            let user = this.user
            console.log(this.user, 'user do join room')
            let room = this.room
            this.connectionServer()
            this.socket.emit('joinRoom',{user,room})
        },
        askChat(){
            console.log('enviei')
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
            console.log(msg)
           this.msgs.push(mensagem)
           this.setScroll(msg)
          
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
        sendChat(data){
            if(this.members[0].id != this.user.id) return
            let userRequest = data.user
            let room = this.room
            let chat = this.msgs
            console.log('enviando o chat')
            this.socket.emit('chatSent', {userRequest, room, chat})
        },
        attChat(data){
            console.log(data, 'att chat')
            if (this.user.id === data.userRequest) {
                setTimeout(() => {
                    this.msgs = data.chat
                }, 100)
            }
        },
        updateMember(member){
            this.members = member
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
    .btn-container{
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
        width: 80px;
        height: 80px;
        background-color: white;
        border-radius: 6px;
        z-index: 2;
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
    .options ul {
        width: 100%;
        height: 100%;
        position: absolute;
    }
    .chat-container {
        height: calc(100% - 50px);
    }
    .chat-screen {
        width: 100%;
        height: calc(100% - 58px);
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
