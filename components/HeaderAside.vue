<template>
  <header :class="{header:'header'}" @mouseenter="toggleShow" @mouseleave="toggleShow">
    <nav>
        <ul>
            <li>
                <fa class="icon" icon="house"/>
                <Transition name="inicio"> 
                    <NuxtLink to="/" v-if="show">Inicio</NuxtLink>
                </Transition>

            </li>
            <li>
                 <fa class="icon" icon="house"/>
                <Transition name="perfil">
                    <NuxtLink to="/perfil" v-if="show">Perfil</NuxtLink>
                 </Transition>
            </li>
            <li>
                 <fa class="icon" icon="house"/>
                <Transition name="conversor">
                    <NuxtLink to="/conversor" v-if="show">Conversor</NuxtLink>
                </Transition>

            </li>
            <li>
                 <fa class="icon" icon="house" />
                <Transition name="assistirJuntos">
                    <NuxtLink to="/assistir-juntos" v-if="show">Assistir Ao Mesmo Tempo</NuxtLink>
                 </Transition>

            </li>
            <li>
                 <fa class="icon" icon="house" />
                <Transition name="assistirSolo">
                    <NuxtLink to="/watch" v-if="show">Assistir Séries Solo</NuxtLink>
                 </Transition>

            </li>
            <li>
                 <fa class="icon" icon="house"/>
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
    name: 'header-aside',
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
    
}
.header li a {
    color: white;
    text-decoration: none;
    font-family: cursive;
    margin: 0px 0px;
    display: inline-block;
    white-space:nowrap;
    
   
}
.header li a:hover {
    color: var(--cor5);
    text-decoration: none;
    font-family: cursive;
    display: inline-block;
    
   
}
.inicio-enter-active {
    transition: 0.7s;
}
.perfil-enter-active {
    transition: 0.8s;
}
.conversor-enter-active {
    transition: 0.9s;
}
.assistirJuntos-enter-active {
    transition: 1.1s
}
.assistirSolo-enter-active {
    transition: 1.2s;
}
.videosEstudando-enter-active {
    transition: 1.3s;
}
.inicio-enter, .perfil-enter, .conversor-enter, 
.assistirJuntos-enter, .assistirSolo-enter, .videosEstudando-enter{
    transform: translate(-300px);
    opacity: 0;
}
.inicio-enter-to, .perfil-enter-to, .conversor-enter-to,
.assistirJuntos-enter-to, .assistirSolo-enter-to, .videosEstudando-enter-to{
    opacity: 1;
    transform: translate(0px);
}
.header:hover .icon{
    position: absolute;
    left: 13.25px;
    font-size: 1.1em;
}
.header:hover li {
    margin: calc(20px - 1.56px) 0px
}
.icon {
    color: white;
    font-size: 1.1em;
    transition: 1s;

}
li a:hover .icon {
    color: var(--cor5) !important;
}
</style>