<template>
  <div id="rooms-container">
    <div class="room-box-container">
        <div class="box-room" v-for="room in rooms" :key="room._id">
            <div class="icon-container">
                <fa :icon="['fab','youtube']"/>
            </div>
            <div class="room-datas">
                <h2>{{room.roomName}}</h2>
                    <LinkSpecial btnProps="Entrar" UrlProps="/"></LinkSpecial>
                <div class="SEM-CRIATIVIDADE-CONTAINER">
                    <span>{{room.members.length}} / {{room.maxMembers}}</span>
                    <span v-if="room.pass">Privada</span>
                </div>
            </div>
        </div>
    </div>
    <!-- <LinkSpecial btnProps="Criar Sala" UrlProps="/"></LinkSpecial> -->

  </div>
</template>

<script>
import axios from 'axios'
import LinkSpecial from '../../components/LinkSpecial.vue'
export default {
    name: '',
    layout: 'default',
    created(){
        axios.get(`${this.$config.dev_url}rooms`).then(room => {
            this.rooms = room.data.rooms
            console.log(this.rooms)
        }).catch(console.log)
    },
    data(){
        return {
            rooms: []
        }
    },
    components: {
        LinkSpecial
    }
}
</script>

<style scoped>
    #rooms-container {
        flex: 1;
        height: 100vh;
    }
    .room-box-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        height: calc(100% - 100px);
        overflow-y: scroll;
    }
    .box-room {
        width: 100%;
        max-width: 510px;
        height: 200px;
        margin: 5px;
        border: 1px solid var(--cor3);
        display: flex;
    }
    .icon-container {
        width: 40%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .icon-container svg {
        font-size: 9.3em;
        color: var(--cor4);
    }
    .room-datas{
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }
    .SEM-CRIATIVIDADE-CONTAINER {
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 0px 10px;
    }
</style>