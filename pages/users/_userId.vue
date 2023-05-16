<template>
    <div class="user">
    <TardisLoadBig v-if="loading"></TardisLoadBig>
        <div class="user-container" v-if="!loading">
            <div class="img-container">
                <img :src="imgSrc">
            </div>
            <div class="name-container">
                <h2>{{name}}</h2><span v-if="emoji != 'false'" v-html="emoji"></span>
            </div>
            <div class="friends" v-if="allSet">
                <button class="AddFriend" v-if="showBtnAdd && !ownerUser" @click="sendFriendRequest()">Add</button>
                <button class="removeFriend" v-if="showBtnAddToRequestedUser && !showPendingWarn && !friend" @click="refuseFriendRequest()">Recusar</button>
                <button class="acceptFriendRequest" v-if="showBtnAddToRequestedUser && !showPendingWarn && !friend" @click="acceptFriendRequest()">Aceitar</button>
                <button class="removeFriend" v-if="friend && !ownerUser" @click="removeFriend()">Remover</button>
                <div class="isPending" v-if="showPendingWarn && !showBtnAddToRequestedUser">pedido enviado</div>
                <NuxtLink :to="'/friends/' + $route.params.userId">Amigos: {{friends}}</NuxtLink>
            </div>
        </div>
        <Erro :erroProps="errRequest" v-if="errRequest != ''"></Erro>
        <div class="description" v-if="!loading">
            <Erro :erroProps="errDescription" v-if="errDescription != ''"></Erro>
            <div class="icon-container">
                <span class="icon" v-if="!editing && ownerUser" @click="editDescription()"><fa icon="pen-to-square"></fa></span>
                <span class="icon" v-if="editing" @click="save()"> <fa icon="check"></fa></span>
                <span class="icon" v-if="editing" @click="cancel()"> <fa icon="xmark"></fa></span>
            </div>
            <p v-if="!editing">{{description}}</p>
            <textarea v-if="editing" v-model="description"></textarea>
            <span class="max-caracter" v-show="editing">{{description.length}}/3333</span>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import io from 'socket.io-client'
import { mapState, mapActions } from 'vuex'
export default {
    name:'',
    async fetch(){
        await this.setState()
        axios.get(`https://www.amigitos-espanol-api.com.br/user/${this.$route.params.userId}`).then(dates => {
            this.name = dates.data.user[0].username
            this.emoji = dates.data.user[0].emoji
            this.description = dates.data.user[0].description
            this.oldDescription = dates.data.user[0].description
            if (dates.data.user[0].profileimg.split('.')[0] === 'default') {
                this.imgSrc = '/default.png'
            }
            else {
                this.imgSrc = dates.data.user[0].profileimg
            }

        }).catch(err =>{})
        let token = this.$cookies.get('token')
        let axiosConfig = {
            headers: {
                authorization: token
            }
        }
        let friendId = this.$route.params.userId
         
        await this.setIsPeding(friendId, axiosConfig)
        await this.setShowBtnAddToRequestedUser(friendId, axiosConfig)
        await this.setIsFriend()
        await this.setAmount()
        this.allSet = true
        await this.getUserFriends({ userId: this.$route.params.userId })
         
    },
    fetchOnServer: false,
    mounted(){
        this.loading = false
         
        this.connectServer()
    },
    head(){
        return {
            title: this.name,
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
    middleware: ['auth'],
    data(){
        return {
            name: '',
            imgSrc: '',
            emoji: '',
            friends: 0,
            loading: true,
            description:'',
            oldDescription: '',
            editing: false,
            userId: '',
            errDescription: '',
            isPending: undefined,
            showBtnAddToRequestedUser: false,
            friend: false,
            allSet: false,
            socket: undefined,
            errRequest: ''

        }
    },
    computed:{
        ...mapState({
            user: state => state.user
        }),
        ownerUser(){
            return this.user.id == this.$route.params.userId
        },
        showBtnAdd(){
            return this.user.id !== parseInt(this.$route.params.userId) && !this.friend && !this.isPending && !this.showBtnAddToRequestedUser
        },
        showPendingWarn() {
            return this.isPending === true && this.user.id !== parseInt(this.$route.params.userId) && !this.showBtnAddToRequestedUser
        }
    },
    watch:{
        description(value,payload){
            let maxCaracter = document.querySelector('.max-caracter').classList
            if(this.description.length >= 3333) {
                maxCaracter.add('pink')
                if (this.description.length >= 5000) {
                    this.description = payload
                    return
                }
                return
            }
            this.errDescription = ''
            maxCaracter.contains('pink') ? maxCaracter.remove('pink') : true
            maxCaracter.add('animation-blink')
            setTimeout(() => {
                maxCaracter.remove('animation-blink')
            }, 400);
        }
    },
    methods: {
        ...mapActions({
            validateUser: 'user/validateUser', verifyIfRequestExist: 'user/verifyIfRequestExist',
            verifyIfUserIsTheRequestedUser:'user/verifyIfUserIsTheRequestedUser', isFriend:'user/isFriend',
            getUserFriends: 'user/getUserFriends', setState:'user/setState', 
            attFriendsInfoState:'friends/attFriendsInfoState', refuseRequest: 'friends/refuseRequest'
        }),
        editDescription(){
            this.editing = true
            setTimeout(() => {
                document.querySelector('textarea').focus()
            }, 100);
        },
        save(){
            let token = this.$cookies.get('token')
            let headersConfig = {
                headers: {
                    authorization:token
                }
            }
            axios.put('https://www.amigitos-espanol-api.com.br/description', {description: this.description}, headersConfig)
            .then(done => {
                this.description = done.data.description,
                this.oldDescription = done.data.description
                this.errDescription = ''
                this.editing = false
            })
            .catch(err => {
                 
                this.errDescription = err.response.data.err
                 
            })    
        },
        cancel(){
            this.description = this.oldDescription
            this.editing = false
        },
        sendFriendRequest(){
            let cookie = this.$cookies.get('token')
            let friendId = this.$route.params.userId
            let axiosConfig = {
                headers:{
                    authorization: cookie
                }
            }
             
            axios.post('https://www.amigitos-espanol-api.com.br/request',{friendId}, axiosConfig).then(async result => {
                await this.setIsPeding(friendId, axiosConfig)
                await this.setShowBtnAddToRequestedUser(friendId, axiosConfig)
                await this.setIsFriend()
                await this.setAmount()
                this.sendNotification()
            }).catch(err => {
                 
                this.errRequest = err.response.data.err
            })
        },
        acceptFriendRequest(){
             let token = this.$cookies.get('token')
            let axiosConfig = {
                headers: {
                    authorization: token
                }
            }
            let friendId = this.$route.params.userId
            axios.post('https://www.amigitos-espanol-api.com.br/friend',{friendId:friendId}, axiosConfig).then(async done => {
                await this.setIsPeding(friendId, axiosConfig)
                await this.setShowBtnAddToRequestedUser(friendId, axiosConfig)
                await this.setIsFriend()
                await this.setAmount()
                await this.attFriendsInfoState(this.user.id)
            }).catch(err => {
                 
            })
        },
        async refuseFriendRequest(){
            let token = this.$cookies.get('token')
            let axiosConfig = {
                headers: {
                    authorization: token
                }
            }
            let friendId = this.$route.params.userId
            try {
                await this.refuseRequest({axiosConfig, friendId})
                await this.setIsPeding(friendId, axiosConfig)
                await this.setShowBtnAddToRequestedUser(friendId, axiosConfig)
                await this.setIsFriend()
                await this.setAmount()
                await this.attFriendsInfoState(this.user.id)
            }
            catch(error){
                 
            }
        },
        async removeFriend(){
            let token = this.$cookies.get('token')
            let axiosConfig = {
                headers: {
                    authorization: token
                }
            }
            let friendId = this.$route.params.userId
            axios.delete(`https://www.amigitos-espanol-api.com.br/friend/${friendId}`,axiosConfig).then(async res => {
                await this.setIsPeding( friendId, axiosConfig)
                await this.setShowBtnAddToRequestedUser(friendId, axiosConfig)
                await this.setIsFriend()
                await this.setAmount()
            }).catch(err => {
                 
            })
        },
        async setIsPeding(friendId, axiosConfig){
            this.isPending = await this.verifyIfRequestExist({ friendId, axiosConfig })
        },
        async setShowBtnAddToRequestedUser(friendId, axiosConfig){
            this.showBtnAddToRequestedUser = await this.verifyIfUserIsTheRequestedUser({ friendId, axiosConfig, userId: this.user.id })
        },
        async setIsFriend() {
            this.friend = await this.isFriend({ friendId: this.$route.params.userId, userId: this.user.id })
        },
        async setAmount(){
            let amount = await axios.get(`https://www.amigitos-espanol-api.com.br/friendsAmount/${this.$route.params.userId}`)
            this.friends = amount.data.friendsAmount
        },
        async connectServer(){
            this.socket = io.connect('https://www.amigitos-espanol-api.com.br/')
        },
        sendNotification(){
            this.socket.emit('friendRequestSent', {userId: this.userId, room: this.$route.params.userId})
        },

    }
    
}
</script>

<style scoped>
    .user {
        flex: 1;
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
    }
    .user-container {
        width: 100%;
        max-width: 1000px;
        height: 140px;
        background-color: var(--cor7);
        display: flex;
        align-items: center;
        padding: 0px 10px;
        margin: 30px auto;
        border-radius: 10px;
        flex-wrap: wrap;
        position: relative;
    }
    .img-container {
        width: 100%;
        max-width: 180px;
        height: 180px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 15px;
        transform: translate(0px, -16px);
    }
    .friends {
        position: absolute;
        right: 5%;
        bottom: 5%;
        font-size: 1.2em;
        font-family: cursive;
        color: white;
    }
    .friends a {
        text-decoration: none;
        color: var(--cor2);
    }
    .AddFriend {
        margin-right: 3px;
        color: var(--cor8);
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    
    }
    h2 {
        color: white;
        transform: translate(0px, -10px);
    }
    .description {
        width: 95%;
        max-width: 725px;
        height: 100%;
        max-height: 300px;
        min-height: 250px;
        background-color: var(--corMenu);
        border: solid 3px var(--cor7);
        border-radius: 5px;
        padding: 1%;
        position: relative;
        margin-top: 50px;
        text-overflow: clip;
        overflow-y:auto;
        margin-bottom: 5px;
    }
    .description p {
        color: white;
        font-size: 1em;
        font-family: cursive;
        word-wrap: break-word;
    }
    .description textarea {
        width: 100%;
        height: calc(100% - 5px);
        background-color: none;
        border-radius: 5px;
        color: white;
        font-size: 1em;
        font-family: cursive;
        resize: none;
        outline: none;
        padding-bottom: 10px;
    }
    .max-caracter {
        position: absolute;
        bottom: 0%;
        right: 0%;
        font-size: 1em;
        font-weight: bolder;
        color: var(--cor7);
        transform: translate(-10px, -10px);
        text-shadow: 0px 0px 0px transparent;
        transition: 0.2s;
    }
    .icon-container {
        position: absolute;
        right: 0;
        top: 0;
    }
    .icon {
        width: 30px;
        height: 30px;
        background-color: var(--cor4);
        font-size: 1em;
        color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1.5px 5px 4.5px 5px;
        cursor: pointer;
    }
    .icon:hover {
        background-color: var(--cor7);
        color: var(--cor6);
        border: 1px solid var(--cor6);
    }
    .animation-blink {
        color: var(--cor6);
        text-shadow: 0px 0px 2px var(--cor5) ;
    }
    .pink {
        color: var(--cor6) !important;
    }

</style>
