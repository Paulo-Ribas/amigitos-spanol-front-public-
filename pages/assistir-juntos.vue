<template>
  <div id="watch">
    <div class="box-container">
        <div class="room-container">
            <div class="room-box1">
                <div class="img-own">
                    <fa :icon="['fab', 'youtube']"></fa>
                </div>
                <NuxtLink to="/room/create" class="roomCreate"></NuxtLink>
                <h2>Assistir Videos Youtube</h2>
            </div>
            <div class="room-box2">
                <div class="img-youtube">
                    <img src="/default.png">
                </div>
                <h2>Assistir Videos Enviados</h2>
                <NuxtLink to="/watch" class="roomCreate"></NuxtLink>
            </div>
        </div>
        <div class="room">
            <LinkSpecialVue UrlProps="/rooms" btnProps="Ver Salas Criadas"/>
        </div>
    </div>
  </div>
</template>

<script>
import LinkSpecialVue from '../components/LinkSpecial.vue'
export default {
    name:'qqq',
    components: {
        LinkSpecialVue
    }

}
</script>

<style scoped>
    #watch{
        flex: 1;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .room{
        width: 100%;
    }
    .box-container {
        min-height: 400px;
        width: 100%;
        max-width: 650px;
        background-color: var(--corMenu);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .room-container {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 4%;
    }
    .room-box1, .room-box2 {
        width: 100%;
        max-width: 300px;
        height: 260px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        border-radius: 50px;
        font-family: cursive;
        transition: 0.1s;
    }
    svg {
        font-size: 9em;
        transition: 0.2s;
    }
    .room-box1:hover {
        box-shadow: 1px 1px 3px;

    }
    h2 {
        color: white;
    }
    .room-box1:hover  svg {
        transform: scale(1.05);
        color: var(--cor4);
    }
    .room-box1:hover h2 {
        color: var(--cor1);
    }
    .roomCreate {
        display: inline-block;
        width: 100%;
        height: 100%;
    }
</style>