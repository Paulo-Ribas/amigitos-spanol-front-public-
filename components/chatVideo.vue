<template>
        <div class="video-menu-container">
            <div class="btn-container" @click="JoinRoom">
                <ButtonSpecialVue btnProps="Escolher Video"/>
            </div>
            <div class="chatMembers-container">
                <div class="container-chat">
                    <div class="members">
                        <div class="member1">
                            <div class="member-container">
                                <img  :src="userImg">
                            </div>
                        </div>
                    </div>
                    <div class="chat-container">
                        <div class="chat-screen">
                            <div class="msg-container" v-for="msg in msgs" :key="msg.id">
                                <div class="name-img-container">
                                    <div class="img-container">
                                        <img :src="msg.userImg">
                                    </div>
                                    <span class="user-name-chat">{{msg.userName}}</span>
                                </div>
                                <div class="msg-text">
                                    <p>
                                    {{msg.text}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="text-area-container">
                            <form class="btn-form">
                                <textarea class="textarealol" @keydown="sendByEnter">
                                </textarea>
                                <input id="send" type="submit" value="enviar" @click="sendMSG">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import ButtonSpecialVue from './buttonSpecial.vue'
import io from 'socket.io-client'
import axios from 'axios'
export default {
    name:'Chat',
    created(){
         this.connectionServer()
    },
    beforeMount(){
        const token = localStorage.getItem('token')
        axios.post('http://localhost:3333/validate',{},{headers:{authorization:`bearer ${token}`}})
        .then(response => {
            const id = response.data.dates.id
            this.userId = id
            axios.get("http://localhost:3333/user/" + id).then(res => {
                console.log(res, ' ta indo?')
                const {username, profileimg} = res.data.user[0]
                this.userImg = profileimg
                this.userName = username
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    },
    mounted(){
    },
        data(){
            return {
                room: this.$route.params.roomId,
                socket: null,
                userName: '',
                userImg: '',
                userId: '',
                msgs: [],
                members: [],
    
            }
        },
    components: {
        ButtonSpecialVue,

    },
    methods:{
        connectionServer(){
           this.socket = io.connect('http://localhost:3333/')
           this.socket.on('msg', data => {
            this.renderMSG(data)
           })
           this.socket.on('memberJoined', data => {
            console.log('entrou', data)
            this.joinMember(data)
           })
           this.JoinRoom()
        },
         JoinRoom(){
            let user = {userName: this.userName, userImg: this.userImg, room: this.room, id: this.userId}
            this.socket.emit('joinRoom',user)
        },
        emitMsg() {
            let msg = document.querySelector('textarea')
            let msgValue = msg.value
            let dates = {
                userName: this.userName,
                userImg: this.userImg,
                userId: this.userId,
                room: this.room,
                text: msgValue
            }
           this.socket.emit('newMSG', dates)
           msgValue = ''
        },
        sendMSG(e){
            e.preventDefault()
            this.emitMsg()
        },
        sendByEnter(key) {
            console.log(key.code)
            if (key.code === "Enter") {
                this.emitMsg()
            }
        },
        renderMSG(msg) {
            let mensagem = {
                userName: msg.userName,
                userImg: msg.userImg,
                text:msg.text,
                id: msg.userId
            }
            console.log(msg)
           this.msgs.push(mensagem)
        },
        joinMember(member){
            let memberJoinded = {
                userName: member.userName,
                userImg: member.userImg,
                id: member.userId
            }
            this.members.push(memberJoinded)
        },
        teste(){
            console.log('teste lol')
        },
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
    }
    .btn-container{
        margin: 10px 5px;
        overflow: hidden;
        border-radius: 5px;
    }
    .container-chat {
        height: 290px;
        background-color: var(--corMenu);
        
    }
    .members {
        height: 50px;
        width: 100%;
        overflow-x: auto;
        display: flex;
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
    }
    .chat-container {
        height: calc(100% - 50px);
    }
    .chat-screen {
        width: 100%;
        height: calc(100% - 45px);
        overflow-y: auto;
    }
    .text-area-container {
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
        background-color: aliceblue;
        font-family: cursive;
        padding: 3px 5px;
    }
    .msg-container {
        width: 100%;
        max-height: 120px;
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
        padding: 5px;
        border-radius: 29px;
        border-top-left-radius: 0px;
        word-break: break-all;
    }
    #send {
        background-color: var(--cor1);
        padding: 10px 10px;
        border-radius: 24px;
    }

</style>