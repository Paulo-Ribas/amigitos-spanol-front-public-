<template>
    <section id="friend-list">
        <div class="friend-list-container" v-if="friendes.length > 0">
            <div v-for="(friend, index) in friendes" :key="index" class="friend-box">
                <div class="dark-wall display-none"></div>
                <span class="icon" v-if="ownerUser" @click="toggleBtn(index)"><fa class="icon" icon="ellipsis"></fa></span>
                <span class="icon display-none xmark" v-if="ownerUser" @click="toggleBtn(index)"><fa class="display-none" icon="xmark"></fa></span>
                <div class="img-container">
                    <img :src="friend.profileimg">
                </div>
                <NuxtLink :to="'/users/' + friend.id" target="_blank">{{ friend.username }}</NuxtLink>
                <div class="remove-friend display-none" v-if="ownerUser">
                    <button @click="remove(friend.id)">Remover</button>
                </div>
            </div>
        </div>
        <h2 class="vazio" v-else-if="loaded">Esse Usuario Não Tem Amigos</h2>
    </section>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    async fetch(){
        await this.setState()
        await this.attFriendsInfoState(this.user.id)
        this.userId = this.$route.params.userId || this.user.id
        let friendList = await this.getUserFriendsInfo(this.userId)
        this.friendes = friendList
        this.loaded = true
         

    },
    fetchOnServer: false,
    head() {
        return {
            title: 'seus amigos',
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
    data(){
        return {
            friendes:[],
            loaded: false,
            userId: undefined,
        }
    },

    computed: {
        ...mapState({friends: state => state.friends, user: state => state.user}),
        ownerUser(){
            return this.user.id == this.userId
        },

    },
    methods:{
        ...mapActions({ setState: 'user/setState', attFriendsInfoState: 'friends/attFriendsInfoState', getUserFriendsInfo: 'friends/getUserFriendsInfo', removeFriend: 'friends/removeFriend'}),
        toggleBtn(index) {
            let btnsArray = document.querySelectorAll('.remove-friend')
            let wallArray = document.querySelectorAll('.dark-wall')
            let ellipsisArray = document.querySelectorAll('[data-icon="ellipsis"]')
            let xmarkArray =  document.querySelectorAll('[data-icon="xmark"]')
            let btn = btnsArray[index]
            let wall = wallArray[index]
            let ellipsis = ellipsisArray[index]
            let xmark = xmarkArray[index]
            
            btn.classList.toggle('display-none')
            wall.classList.toggle('display-none')
            ellipsis.classList.toggle('display-none')
            xmark.parentElement.classList.toggle('display-none')
            xmark.classList.toggle('display-none')
            
        },
        async remove(userId){
            let friendId = userId
            let token = this.$cookies.get('token')
             let axiosConfig = {
                headers: {
                    authorization: token
                }
            }
            try {
             await this.removeFriend({friendId, axiosConfig})
             let friendList = await this.getUserFriendsInfo(this.userId)
                this.friendes = friendList      
            } catch (error) {
                 
            }
        }
    },
}

</script>

<style scoped>
    #friend-list {
        flex: 1;
        height: 100vh;
        justify-content: center;
        align-items: center;
        display: flex;
        overflow-y: scroll;
    }
    .vazio {
        font-family: cursive;
        color: white;
    }
    .friend-list-container {
        width: 95%;
        height: 100%;
        max-width: 1280px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding-top: 10px;
    }
    .friend-box {
    width: calc(33% - 4px) ;
    height: 33%;
    max-width: 350px;
    min-width: 300px;
    max-height: 240px;
    margin: 3px 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: var(--corMenu);
    position: relative;
    z-index: 1;
    border-radius: 10px;
    margin-bottom: 2px;
    padding-top: 3px;
    box-shadow: 2px 2px 5px var(--cor7);
    transition: 0.3s;
    cursor: pointer;
    position: relative;
}
.friend-box:hover {
    box-shadow: 9px 9px 5px var(--cor3);
}
.friend-box:hover a {
    color: var(--cor1);
}
.img-container {
    width: 100%;
    height: 100%;
    max-width: 350px;
    max-height: 210px;
    position: relative;
}
.img-container img {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    object-fit: contain;
    border-radius: 15px;
}
.friend-box a {
    font-size: 1.2em;
    color: var(--cor4);
    text-decoration: none;
    font-family: cursive;
    font-weight: 500;
    
}
.friend-box a:hover {
    color: var(--cor8) !important;
    text-decoration: underline;
}
.icon{
    position: absolute;
    top: 2px;
    right: 3px;
    z-index: 5;
    color: var(--cor4);
    box-shadow: 0px 0px 3px var(--cor2);
    font-size: 1.3em;
    padding: 11px;
    transition: 0.2s;
}
.icon:hover {
    padding: 0px;
    box-shadow: 0px 0px 5px var(--cor2);
    border-radius: 3px;
}
.dark-wall {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 4;
    background-color: var(--corMenu);
}
.remove-friend {
    opacity: 1;
    width: 80%;
    min-width: 40px;
    transition: 1s;
    transition-delay: 0.3s;
    color: white;
    font-size: 1.2em;
    font-family: cursive;
    border: 1px solid white;
    border-radius: 5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: absolute;
    z-index: 5;
}
.remove-friend button {
    height: 0%;
    width: 100%;
    display: flex;
    padding: 5px 0px;
    justify-content: center;
    align-items: center;
    background-color: var(--cor6);
    transition: 0.2s;
    background-clip: content-box;
}
.remove-friend:hover > button {
    height: 100%;
    background-clip: padding-box;
}
.display-none {
    display: none;
}
.xmark {
    color: var(--cor2)!important;
    z-index: 5 !important;
    padding: 10px !important;
    box-shadow: 0px 0px 3px var(--cor1);
}
</style>