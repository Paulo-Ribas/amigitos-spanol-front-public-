<template>
  <div id="watch">
    <div class="box-container">
        <div class="room-container">
            <NuxtLink to="/room/create/youtube" class="room-box1">
                <fa :icon="['fab', 'youtube']"></fa>
                <h2>Assistir Videos Youtube</h2>
            </NuxtLink>
            <NuxtLink to="/room/create/upload" class="room-box2">
                 <fa icon="upload"></fa>
                <h2>Assistir Videos Enviados</h2>
            </NuxtLink>
        </div>
        <div class="room">
            <LinkSpecial UrlProps="/room" btnProps="Ver Salas Criadas"/>
        </div>
    </div>
  </div>
</template>

<script> 
export default {
    head(){
        return {
            title: 'assistir juntos',
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
    middleware: ['auth']

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
        min-height: 360px;
        width: 100%;
        max-width: 650px;
        background-color: var(--corMenu);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .room-container {
        width: 100%;
        height: calc(100% - 39px);
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
        max-height: 260px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        border-radius: 50px;
        font-family: cursive;
        transition: 0.1s;
        text-decoration: none;
    }
    .room-box1:active , .room-box2:active {
        color: var(--cor6);
    }
    svg {
        font-size: 9em;
        color: white;
        transition: 0.2s;
    }
    .room-box1:hover, .room-box2:hover {
        box-shadow: 1px 1px 3px;

    }
    h2 {
        color: white;
    }
    .room-box1:hover svg, .room-box2:hover svg{
        transform: scale(1.05);
        color: var(--cor4);
    }
    .room-box1:hover h2, .room-box2:hover h2 {
        color: var(--cor1);
    }
    .roomCreate {
        display: inline-block;
        width: 100%;
        height: 100%;
    }
     @media screen and (max-width: 670px) {
    .box-container {
      flex-direction: column;
      height: 100%;
    }
    .room-box1, .room-box2 {
        height: 50%;

    } 
    
  }
</style>