<template>
  <header :class="{header:'header'}" id="header-menu" v-if="!mobile" @mouseover="showTrue" @mouseleave="showOff">
    <nav>
        <ul>
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
  <header :class="{mobile:'mobile', width100}" id="header--mobile" v-else>
    <div :class="{'tardis-icon-menu': 'tardis-icon-menu', move, 'vertical-mobile-tardis-icon': vertical }" @click="toogleMobileMenu">
        <img src="/svg/tardis.svg" :class="{spinTardis , tardisNormal}"/>
    </div>
    <nav>
        <ul>
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
export default {
    data(){
        return {
            show: false,
            mobile: false,
            width100: false,
            spinTardis: false,
            move: false,
            tardisNormal: true,
            vertical: false
            
        }
    },
    created(){
        this.responsive()
    },
    mounted(){
        this.checkVerticalMobile()
    },
    beforeDestroy(){
        this.responsive()
    },
    watch: {
        mediaQuery(value, payload){
            this.responsive()
        }
    },
    computed: {
        mediaQuery(){
            return this.$mq
        }
    },
    methods:{
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
            this.toggleShow()
            !this.spinTardis ? this.spinTardis = true : this.spinTardis = false
            !this.move ? this.move = true : this.move = false
            !this.tardisNormal ? this.tardisNormal = true : this.tardisNormal = false
            console.log('clicado')
            this.checkVerticalMobile()
        },
        responsive(){
            console.log(this.$mq)
            if (this.$mq === 'sm' || this.$mq === "md") {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        },
        checkVerticalMobile(){
            console.log('indo no if')
            if (this.$mq === "md" && this.move) {
                this.vertical = true
            }
            else {
                console.log('tirando o coisa', document.querySelector('.tardis-icon-menu'))
            this.vertical = false
            }
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
.inicio-enter, .perfil-enter, .conversor-enter, 
.assistirJuntos-enter, .assistirSolo-enter, .videosEstudando-enter{
    transform: translate(-174%, -50%) !important;
    opacity: 0;
}
.inicio-enter-to, .perfil-enter-to, .conversor-enter-to,
.assistirJuntos-enter-to, .assistirSolo-enter-to, .videosEstudando-enter-to{
    opacity: 1;
    transform: translate(-50%, -50%) !important;
}
.inicio-leave, .perfil-leave, .conversor-leave, 
.assistirJuntos-leave, .assistirSolo-leave, .videosEstudando-leave{
    transform: translate(-50%,-50%) !important;
    opacity: 1;
}
.inicio-leave-to, .perfil-leave-to, .conversor-leave-to,
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