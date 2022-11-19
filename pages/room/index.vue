<template>
  <div id="rooms-container">
    <div class="room-box-container" v-if="roomFinal.length > 0">
        <div class="box-room" v-for="room in roomFinal" :key="room._id">
            <div class="icon-container" v-if="room.type === 'youtube'">
                <fa :icon="['fab','youtube']"/>
            </div>
            <div class="icon-container" v-if="room.type === 'upload'">
                <fa :icon="'upload'"/>
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
    <div class="room-box-container" v-else>
        <h2 class="vazio">Sem Salas Criadas</h2>
    </div>
    <LinkSpecial class="create-room" btnProps="Criar Sala" UrlProps="/assistir-juntos"></LinkSpecial>
  </div>

</template>

<script>
import io from 'socket.io-client'
export default {
    name: '',
    layout: 'default',
    middleware:['auth'],
    async asyncData(context){
       let rooms = await context.$axios.$get(`rooms`)
       return {
        rooms: rooms.rooms
       }

    },
    created(){
        this.connectionServer()
    },
    beforeMount(){
        this.checkRooms()
    },
    data(){
        return {
            socket: null,
        }
    },
    computed:{ 
        roomFinal(){
            let roomRendered = this.rooms.filter(room => {
                return room.rendered === true
            })
            return roomRendered
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
            this.socket.emit('startVerify')
            setInterval(() => {
                this.socket.emit('deleteRoomsWith0Members')
            }, 10000);
            setInterval(() => {
                this.socket.emit('startVerify')
            }, 14000)
        }
    }
}
</script>

<style scoped>
    #rooms-container {
        flex: 1;
        height: 100vh;
        overflow-y: auto;
    }
    #rooms-container .create-room {
        width: 70%;
        margin: auto;
        border-radius: 32px;
        margin-top: -2px;
      
    }
    .room-box-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        height: calc(100% - 39px);
        overflow-y: scroll;
    }
    .box-room {
        width: 100%;
        max-width: 510px;
        height: 197px;
        margin: 5px;
        border: 2px solid var(--cor5);
        display: flex;
        border-radius: 10px;
        overflow: hidden;
    }
    .vazio {
        font-family: cursive;
        color: white;
    }
    .icon-container {
        width: 40%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--corMenu);
    }
    .icon-container svg {
        font-size: 9.3em;
        color: white;
    }
    .room-datas{
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        font-family: cursive;
        background: var(--background);
    }
    .room-datas h2 {
        color: white;
        text-align: center;
        word-break: break-word;
    }
    .room-datas a {
        width: 90%;
        border-radius: 7px;
    }
    .SEM-CRIATIVIDADE-CONTAINER {
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 0px 10px;
        color: var(--cor7);
    }
    @media screen and (max-width: 400px) {
        .box-room {
            flex-direction: column;
        }
        .icon-container {
            height: 30%;
            width: 100%;
        }
        .icon-container svg {
            font-size: 3.2em;
        }
        .room-datas {
            height: 70%;
            width: 100%;
        }
        .SEM-CRIATIVIDADE-CONTAINER {
            justify-content: space-evenly;
        }
        
    }
</style>