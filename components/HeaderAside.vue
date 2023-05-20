<template>
  <header :class="{header:'header'}" id="header-menu" v-if="!mobile" @mouseover="showTrue" @mouseleave="showOff">
    <nav>
        <ul>
            <li class="friend-request" v-if="friends.requests.length > 0">
                <div class="icon-container">
                    <fa class="icon friend-request-icon" icon="user-group"></fa>
                    <span class="amount">{{ friends.requests.length }}</span>
                </div>
                <Transition name="friendRequestLink">
                    <NuxtLink to="/friendsRequest" v-if="show">Solicitações</NuxtLink>
                </Transition>
            </li>
            <li class="room-invite" v-if="roomInvite.length > 0">
                <div class="incon-container">
                    <fa class="icon room-invited" icon="people-roof"></fa>
                    <span class="amount">{{ roomInvite.length }}</span>
                </div>
                <Transition name="invitedToRoom">
                    <NuxtLink to="/roomInvited" v-if="show">Convites De Salas</NuxtLink>
                </Transition>
            </li>
            <li>
                <div class="icon-container">
                    <fa class="icon" icon="house"/>
                </div>
                <Transition name="inicio"> 
                    <NuxtLink to="/" v-if="show">Inicio</NuxtLink>
                </Transition>

            </li>
            <li>
                <div class="icon-container">
                    <fa class="icon" icon="user"/>
                </div>
                <Transition name="perfil">
                    <NuxtLink to="/perfil" v-if="show">Perfil</NuxtLink>
                 </Transition>
            </li>
            <!-- <li>
                 <fa class="icon" icon="movie"/>
                <Transition name="conversor">
                    <NuxtLink to="/conversor" v-if="show">Conversor</NuxtLink>
                </Transition>

            </li> -->
            <li>
                <div class="icon-container">
                    <fa class="icon" icon="users" />
                </div>
                <Transition name="assistirJuntos">
                    <NuxtLink to="/assistir-juntos" v-if="show">Assistir Ao Mesmo Tempo</NuxtLink>
                 </Transition>

            </li>
            <li>
                <div class="icon-container">
                    <img class="icon" src="/svg/tardis.svg" />
                </div>
                <Transition name="assistirSolo">
                    <NuxtLink to="/watch" v-if="show">Assistir Séries Solo</NuxtLink>
                 </Transition>

            </li>
            <li>
                <div class="icon-container">
                    <fa class="icon" icon="chalkboard"/>
                </div>
                <Transition name="videosEstudando">
                    <NuxtLink to="/videos-estudando" v-if="show">Videos Estudando</NuxtLink>
                 </Transition>

            </li>
        </ul>
    </nav>
  </header>
  <header :class="{mobile:'mobile', width100}" id="header-mobile" v-else>
    <div :class="{'tardis-icon-menu': 'tardis-icon-menu', move, horizontal}" @click="toogleMobileMenu()">
        <img src="/svg/tardis.svg" :class="{spinTardis , tardisNormal}">
        <div class="icon-container-notification" v-if="friends.requests.length > 0">
            <span class="amount">{{ friends.requests.length }}</span>
        </div>
    </div>
    <nav>
        <ul>
            <li class="friend-request" v-if="friends.requests.length > 0">
                    <Transition name="friendRequestLink">
                        <NuxtLink to="/friendsRequest" v-if="show" @click="toggleMobileMenu">Solicitações</NuxtLink>
                    </Transition>
                </li>
            <li @click="toogleMobileMenu">
                <div class="icon-container">
                    <fa class="icon" icon="house"/>
                </div>
                <Transition name="inicio"> 
                    <NuxtLink to="/" v-if="show" @click="toogleMobileMenu">Inicio</NuxtLink>
                </Transition>

            </li>
            <li @click="toogleMobileMenu">
                <div class="icon-container">
                    <fa class="icon" icon="user"/>
                </div>
                <Transition name="perfil">
                    <NuxtLink to="/perfil" v-if="show" @click="toogleMobileMenu">Perfil</NuxtLink>
                 </Transition>
            </li>
            <!-- <li>
                 <fa class="icon" icon="movie"/>
                <Transition name="conversor">
                    <NuxtLink to="/conversor" v-if="show">Conversor</NuxtLink>
                </Transition>

            </li> -->
            <li  @click="toogleMobileMenu">
                <div class="icon-container">
                    <fa class="icon" icon="users" />
                </div>
                <Transition name="assistirJuntos">
                    <NuxtLink to="/assistir-juntos" v-if="show">Assistir Ao Mesmo Tempo</NuxtLink>
                 </Transition>

            </li>
            <li @click="toogleMobileMenu">
                <div class="icon-container">
                    <img class="icon" src="/svg/tardis.svg" />
                </div>
                <Transition name="assistirSolo">
                    <NuxtLink to="/watch" v-if="show" @click="toogleMobileMenu">Assistir Séries Solo</NuxtLink>
                 </Transition>

            </li>
            <li @click="toogleMobileMenu">
                <div class="icon-container">
                    <fa class="icon" icon="chalkboard"/>
                </div>
                <Transition name="videosEstudando">
                    <NuxtLink to="/videos-estudando" v-if="show" @click="toogleMobileMenu">Videos Estudando</NuxtLink>
                 </Transition>

            </li>
        </ul>
    </nav>
  </header>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import io from 'socket.io-client'
export default {
    async fetch(){
        try {
            await this.setState()
             
            await this.attFriendsInfoState(this.user.id)
             
            
        } catch (error) {
            throw error
        }
    },
    fetchOnServer: false,
    async beforeMount(){
        let token = this.$cookies.get('token')
        await this.validateUser(token).then(userId => { 
            this.userId = `${userId.id}`
            this.connectionServer()
        }).catch(err =>  {
            
        }
        )
    },
    data(){
        return {
            show: false,
            mobile: false,
            width100: false,
            spinTardis: false,
            move: false,
            tardisNormal: true,
            vertical: false,
            userId: undefined,
            socket: undefined,
            amount: 0,
            roomInvite: [],
            horizontal: false,
            
        }
    },
    created(){
        this.responsive()
    },
    async mounted(){
         
        this.checkHorizontalMobile()
        let token = this.$cookies.get('token')
        let axiosConfig = {
            headers: {
                authorization: token
            }
        }
        let requests = await this.getUserRequests({userId: this.userId, axiosConfig})
         
        this.amount = requests.length
    },
    beforeDestroy(){
        this.responsive()
    },
    watch: {
        mediaQuery(value, payload){
            this.responsive()
            this.checkHorizontalMobile()
            
        },
    },
    computed: {
        mediaQuery(){
            return this.$mq
        },
        ...mapState({friends: state => state.friends, user: state => state.user})

    },
    methods:{
        ...mapActions({
            validateUser: 'user/validateUser', verifyAmount: 'user/verifyAmount',
            getUserRequests:'friends/getUserRequests', setState:'user/setState',
            attFriendsInfoState: 'friends/attFriendsInfoState'
        }),
        toggleShow(){
            this.show ? this.show = false : this.show = true
        },
        showTrue(){
                this.show = true
        },
        showOff(){
            this.show = false

        },
        toogleMobileMenu(){
            !this.width100 ? this.width100 = true : this.width100 = false
            this.checkHorizontalMobile()
            this.toggleShow()
            !this.spinTardis ? this.spinTardis = true : this.spinTardis = false
            !this.move ? this.move = true : this.move = false
            !this.tardisNormal ? this.tardisNormal = true : this.tardisNormal = false
        },
        responsive(){
            if (this.$mq === 'sm' || this.$mq === "md") {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        },
        checkHorizontalMobile(){
             
            if (this.$mq === "md" && this.show && this.move) {
                this.horizontal = true
                this.move = false
            }
            if(this.$mq === "md" && !this.show) {
                this.horizontal = false

            }
            else {
                this.horizontal = false
            }
        },
        connectionServer(){
             
             this.socket = this.socket = io.connect('https://www.amigitos-espanol-api.com.br/', { rememberTransport: false, transports: ['websocket', 'polling', 'Flash Socket', 'AJAX long-polling'] })
             this.socket.emit('joinFriendRequestsRoom', `${this.userId}`)
             this.socket.on('notification', async data => {
                 
                await this.attFriendsInfoState()
             })
             this.socket.on('roomNotification', data => {
                this.roomInvite.push(data)
                 
             })
        }

    }
    


}
</script>

<style scoped>

.tardis-icon-menu {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: 4px solid var(--cor3);
    box-shadow: 0px 0px 3px var(--cor2);
    position: absolute;
    top: 2%;
    left: 2%;
}
.tardis-icon-menu img {
    position: absolute;
    width: 99%;
    height: 99%;
    transition: 1s;
    transform: rotateY(0deg);
}
.header{
    background: var(--corMenu);
    height: 100vh;
    width: 50px;
    transition: width 1s;
        
}
.horizontal {
    top: calc(0% + 29px) !important;
    left: 95% !important;
    transform: translate(-95%, 0%) !important;
}
#header-mobile {
}
.mobile {
    background: var(--corMenuMobile);
    height: 100vh;
    width: 0%;
    transition: width 1s;
    position: absolute;
    left: 0;
    z-index: 10;
        
}
.width100 {
    width: 100% !important;
    overflow-y: auto;
}
.header:hover{
    width: 280px;
}
.header nav, ul {
    width: 100%;
}
.mobile nav, ul {
    width: 100%;
    margin-top: 30px;
}
.header ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    
}
.mobile ul {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.header li {
    list-style: none;
    margin: 20px 0px;
    position: relative;
    width: 100%;
    text-align: center;
    height: 25px;
    
}
.friend-request{
    list-style: none;
    margin: -20px 0px 5px 0px !important;
    position: relative;
    width: 100%;
    text-align: center;
    height: 25px;
}
.mobile li {
    list-style: none;
    margin: 20px 0px;
    position: relative;
    width: 100%;
    text-align: center;
    height: 25px;
}
.header li a {
    color: white;
    text-decoration: none;
    font-family: cursive;
    margin: 0px 0px;
    display: inline-block;
    white-space:nowrap;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.mobile li a {
    color: white;
    text-decoration: none;
    font-family: cursive;
    margin: 0px 0px;
    display: inline-block;
    white-space:nowrap;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.header li a:hover {
    color: var(--cor5);
    
   
}
.mobile li a:active {
    color: var(--cor5);
}
.friendRequestLink-enter-active, .friendRequestLink-leave-active {
    transition: 0.6s;
} 
.inicio-enter-active, .inicio-leave-active {
    transition: 0.7s;
}
.perfil-enter-active, .perfil-leave-active {
    transition: 0.8s;
}
.conversor-enter-active, .conversor-leave-active {
    transition: 0.9s;
}
.assistirJuntos-enter-active, .assistirJuntos-leave-active {
    transition: 1.1s
}
.assistirSolo-enter-active, .assistirSolo-leave-active {
    transition: 1.2s;
}
.videosEstudando-enter-active, .videosEstudando-leave-active {
    transition: 1.3s;
}
.friendRequestLink, .inicio-enter, .perfil-enter, .conversor-enter, 
.assistirJuntos-enter, .assistirSolo-enter, .videosEstudando-enter{
    transform: translate(-174%, -50%) !important;
    opacity: 0;
}
.friendRequestLink, .inicio-enter-to, .perfil-enter-to, .conversor-enter-to,
.assistirJuntos-enter-to, .assistirSolo-enter-to, .videosEstudando-enter-to{
    opacity: 1;
    transform: translate(-50%, -50%) !important;
}
.friendRequestLink, .inicio-leave, .perfil-leave, .conversor-leave, 
.assistirJuntos-leave, .assistirSolo-leave, .videosEstudando-leave{
    transform: translate(-50%,-50%) !important;
    opacity: 1;
}
.friendRequestLink, .inicio-leave-to, .perfil-leave-to, .conversor-leave-to,
.assistirJuntos-leave-to, .assistirSolo-leave-to, .videosEstudando-leave-to{
    opacity: 0;
    transform: translate(-174%, -50%) !important;
}
.vertical-mobile-tardis-icon {
    top: calc(1% - -29px) !important;
}

.icon-container{
    position: relative;
    width: 100%;
    max-width: 50px;
    height: 100%;
}
.icon-container-notification {
    width: 100%;
    height: 100%;
    position: relative;
}
.icon-container-notification .amount {
    position: absolute;
    top: 100%;
    left: 100%;
    transform: translate(-50%, -60%);
    color: var(--cor6);
    text-shadow: 1px 1px 6px var(--cor7), 0px 0px 6px var(--cor7), -1px -1px 6px var(--cor7);
    font-size: 1.6em;
    font-weight: bolder;
    z-index: 4;
    font-weight: bolder;
}
.mobile .icon-container {
    display: none;
}

.icon {
    color: white;
    font-size: 1.1em;
    transition: 1s;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

}
.friend-request-icon {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translate(14%, -50%);
    color: var(--cor9)
}
.amount {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translate(135%, -30%);
    color: white;
    font-size: 1.5em;
    font-weight: bolder;
    z-index: 4;
}
li a:hover .icon {
    color: var(--cor5) !important;
}
.spinTardis {
    animation: tardisMenuSpin 3s;
    animation-fill-mode: forwards;
}
.move {
    animation: TardisMenu 2s;
    animation-fill-mode: forwards;
}
.tardisNormal {
    animation: opacity 0.6s;
    animation-fill-mode: forwards;
}
 @keyframes TardisMenu {
    33% {
        top: 2%;
        left: 2%;
    }
    33% {        
        top: 41%;
        left: 80%;
        transform: translate(-80%, -41%);}
    100% {
        top: 71%;
        left: 50%;
        transform: translate(-50%, -71%);
    }
 }
 @keyframes TardisMenuAside {
    33% {
        top: 2%;
        left: 2%;
    }
    33% {        
        top: 41%;
        left: 80%;
        transform: translate(-80%, -41%);}
    100% {
        top: 71%;
        left: 50%;
        transform: translate(513%, 28%);
    }
    
 }
 @keyframes tardisMenuSpin {
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(711deg);
    }
    
 }
 @keyframes opacity {
    from {
        opacity: 0.2;
    }
    to {
        opacity: 1;
    }
 }
</style>