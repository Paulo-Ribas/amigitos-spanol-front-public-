<template>
  <section id="friends-request">
    <TardisLoadBig v-if="!loaded"/>
    <div class="friends-request-container" v-if="requests.length > 0 && !mobile">
        <div v-for="(friend, index) in requests" :key="index" class="friend-box">
            <div class="img-container">
                <img :src="friend.profileimg">
            </div>
            <NuxtLink :to="'/users/' + friend.id" target="_blank">{{friend.username}}</NuxtLink>
            <div class="accept-refuse-container">
                <div class="accept-refuse-btns">
                    <div class="button-container-accept">
                        <button @click="accept({friendId:friend.id, axiosConfig})">Aceitar</button>
                    </div>
                    <div class="button-container-refuse">
                        <button @click="refuse({friendId:friend.id, axiosConfig})">Recusar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="friends-request-container" v-if="requests.length > 0 && mobile">
            <div v-for="(friend, index) in requests" :key="index" class="friend-box">
                <div class="img-container" @click="showActions(friend.id)">
                    <img :src="friend.profileimg">
                </div>
                <NuxtLink :to="'/users/' + friend.id" target="_blank">{{ friend.username }}</NuxtLink>
                <div class="accept-refuse-container" :data-user="friend.id">
                    <div class="accept-refuse-btns">
                        <div class="button-container-accept">
                            <button @click="accept({ friendId: friend.id, axiosConfig })">Aceitar</button>
                        </div>
                        <div class="button-container-refuse">
                            <button @click="refuse({ friendId: friend.id, axiosConfig })">Recusar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     <h2 class="vazio" v-if="loaded && requests.length === 0">Sem Requisições</h2>
  </section>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
export default {
    async fetch(){
        await this.setState()
        await this.attFriendsInfoState(this.user.id)
        this.loaded = true
         
    },
    fetchOnServer: false,
    beforeMount(){
        this.responsive()
    },
    head() {
        return {
            title: 'amantes secretos',
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
            axiosConfig: undefined,
            mobile: false,
            loaded: false
        }
    },
    watch:{
        user(value, payload){
             
        }
    },
    computed:{
        ...mapState({user: state => state.user, request: state => state.friends}),
        requests(){
            return this.request.requests
        },
        mq() {
            return this.$mq
        }
    },
    methods: {
        ...mapActions({validateUser:'user/validateUser', acceptRequest: 'friends/acceptFriendRequest', 
        refuseRequest:'friends/refuseRequest', setState:'user/setState', attFriendsInfoState:'friends/attFriendsInfoState'}),
        responsive() {
            if (this.$mq === 'sm' || this.$mq === "md") {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        },
        async accept(payload){
            try {
                await this.acceptRequest(payload)
                await this.attFriendsInfoState(this.user.id)

            } catch (error) {
                throw error
            }

        },
        async refuse(payload){
            try {
                await this.refuseRequest(payload)
                await this.attFriendsInfoState(this.user.id)

            } catch (error) {
                throw error
            }
        },
        showActions(userId){
            let container = document.querySelector(`[data-user="${userId}"]`)
            container.classList.toggle('showBtn')
        },
    }
}
</script>

<style scoped>
#friends-request {
    flex: 1;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.vazio {
    font-family: cursive;
    color: white;
}
.friends-request-container{
    width: 100%;
    height: 100%;
    max-width: 1015px;
    border: 1px solid var(--cor7);
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    background-color: var(--chatOpacity);
    border-radius: 33px;
    overflow: hidden;
    
}
.friend-box {
    width: 100%;
    height: 250px;
    max-width: 390px;
    max-height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: var(--corMenu);
    position: relative;
    z-index: 1;
    border-radius: 2px;
    margin-bottom: 2px;
}
.img-container {
    width: 100%;
    height: 100%;
    max-width: 385px;
    max-height: 215px;
    position: relative;
}
.img-container img {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    object-fit: contain;
    border-radius: 10px;
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
.accept-refuse-container {
    width: 0%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 100%;
    background-color: var(--corMenuMobile);
    display: flex;
    align-items: center;
    transition: 1s;
    border-radius: 2px;
    z-index: 2;

}

.accept-refuse-btns {
    width: 100%;
    height: 0%;
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    transition: 1s;
}
.button-container-accept, .button-container-refuse {
    opacity: 0;
    width: 10%;
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
}
.button-container-accept button, .button-container-refuse button {
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
.button-container-accept:hover > button, .button-container-refuse:hover > button {
    height: 100%;
    background-clip: padding-box;
}
.friend-box:hover a {
    color: var(--cor3);
}
.friend-box:hover .accept-refuse-container{
    width: 100%;
    display: flex;
    z-index: 4;
}
.friend-box:hover .accept-refuse-btns {
    opacity: 1;
    height: 100%;
}
.friend-box:hover .button-container-refuse, .friend-box:hover .button-container-accept {
    opacity: 1;
    width: 95%;
}
.showBtn {
    width: 100% !important;
    opacity: 1 !important;
    z-index: 2;
}
@media screen and (max-width: 870px) {
    .accept-refuse-container {
    width: 0% !important;
    opacity: 0;
    height: 100%;
    max-width: calc(640px - 100%);
    position: absolute;
    top: 0;
    left: 100%;
    background-color: var(--corMenuMobile);
    display: flex;
    align-items: center;
    transition: 1s;
    border-radius: 2px;
    z-index: 0 !important;

}

.accept-refuse-btns {
    width: 100%;
    height: 100%;
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    transition: 1s;
}
    .button-container-accept button, .button-container-refuse button {
    height: 100%;
    background-clip: padding-box;
}
.friend-box a {
    color: var(--cor3);
}
.friend-box .accept-refuse-container{
    width: 100%;
    display: flex;
    z-index: 4;
}
.friend-box .accept-refuse-btns {
    opacity: 1;
    height: 100%;
}
.friend-box .button-container-refuse, .friend-box .button-container-accept {
    opacity: 1;
    width: 95%;
}
.showBtn {
    width: 100% !important;
    opacity: 1 !important;
    z-index: 2 !important;
}
}
@media screen and (max-width: 500px) {
    .friends-request-container {
        flex-direction:row;
        flex-wrap: wrap;
        overflow-y: auto;
        justify-content: flex-start;
    }
    .friend-box {
        max-height: 250px;
        overflow: unset;
    }
    .accept-refuse-container {
    width: 0% ;
    opacity: 0;
    height: 100%;
    max-width: calc(640px - 100%);
    position: absolute;
    top: 0;
    left: 0% !important;
    background-color: var(--corMenuMobile);
    display: flex;
    align-items: center;
    transition: 1s;
    border-radius: 2px;
    z-index: 0 !important;

}
.showBtn {
    width: 100% !important;
    opacity: 1 !important;
    z-index: 2 !important;
}
}
/* .friend-box:hover .accept-refuse-container .accept-refuse-btns .accept-refuse-btns button{
    opacity:1;
} */


</style>