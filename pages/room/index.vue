<template>
  <div id="rooms-container">
    <div class="room-box-container">
        <div class="box-room" v-for="room in rooms" :key="room._id">
            <h2>{{room.roomName}}</h2>
            <span>Membros: {{room.members.length}} / {{room.MaxMembers}}</span>
            <span v-if="room.pass">Privada</span>
            <LinkSpecial btnProps="Entrar" UrlProps="/"></LinkSpecial>
        </div>
    </div>
    <LinkSpecial btnProps="Criar Sala" UrlProps="/"></LinkSpecial>

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
        width: 300px;
        height: 300px;
        margin: 5px;
        border: 1px solid var(--cor3);
    }

</style>>

</style>