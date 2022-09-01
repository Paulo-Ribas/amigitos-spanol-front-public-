<template>
  <header :class="{header:'header'}" @mouseenter="toggleShow" @mouseleave="toggleShow">
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
                    <NuxtLink to="/" v-if="show">Videos Estudando</NuxtLink>
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
            
        }
    },
    methods:{
        toggleShow(){
             this.show ? this.show = false : this.show = true
                
          
        }
    }
    


}
</script>

<style scoped>
@font-face {
    font-family: 'Secular';
    src: url('./static/fonts/SecularOne-Regular.ttf');
}
.header{
    background: var(--corMenu);
    height: 100vh;
    width: 50px;
    transition: width 1s;
        
}
.header:hover{
    width: 280px;
}
.header nav, ul {
    width: 100%;
}
.header ul {
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
.header li a:hover {
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

.icon-container{
    position: relative;
    width: 100%;
    max-width: 50px;
    height: 100%;
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
</style>