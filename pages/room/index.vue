<template>
  <div id="rooms-container">
    <div class="room-box-container">
        <div class="box-room" v-for="room in roomFinal" :key="room._id">
            <div class="icon-container">
                <fa :icon="['fab','youtube']"/>
            </div>
            <div class="room-datas">
                <h2>{{room.roomName}}</h2>
                    <LinkSpecial btnProps="Entrar" :UrlProps="'/watch/uploads/' + room.url"></LinkSpecial>
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
import io from 'socket.io-client'
export default {
    name: '',
    layout: 'default',
    middleware:['auth'],
    async asyncData(context){
       let rooms = await context.$axios.$get(`${context.$config.dev_url}rooms`)
       return {
        rooms: rooms.rooms
       }

    },
    created(){
        this.connectionServer()
        this.checkRooms()
        this.socket.emit('deleteRoomsWith0Members')
    },
    data(){
        return {
            socket: null,
        }
    },
    computed:{ 
        roomFinal(){
            return this.rooms
        }
    },
    methods: {
        connectionServer(){
            this.socket = io.connect('http://localhost:3333/')
            this.socket.on('roomRefresh', data => {
                this.socket.emit('deleteRoomsWith0Members')
            })
            this.socket.on('updateRoomPage', data => {
                this.rooms = data
            })
              
        },
        checkRooms(){
            setInterval(() => {
                this.socket.emit('deleteRoomsWith0Members')
            }, 10000);
        }
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