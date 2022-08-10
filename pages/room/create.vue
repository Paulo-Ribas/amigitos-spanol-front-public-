<template>
  <div id="creating">
    <Erro :erroProps="erro" v-if="erro != ''"></Erro>
    <div class="container-box-poop" v-if="showAlgo">
      <div class="warn-container">
        <h2>Selecione Os Videos</h2>
            <TabbleContainer btnProps="Selecionar" :videosProps="videos" @selected="addOrRemoveVideo($event)"/>
        <div class="btn-container">
            <button class="yes" @click="yes">Pronto</button>
            <button class="no" @click="close">Cancelar</button>
        </div>
      </div>
    </div>
    <div class="container" v-if="!showAlgo">
        <form @submit="preventSubmit($event), sendRoomData()">
            <div class="container-1">
                <div class="name">
                    <label>Nome Da Sala:</label>
                    <input type="text" name="roomName" v-model="name">
                </div>
                <div class="membersNumber">
                    <label>max membros:</label>
                    <input type="text" id="maxMembers" v-model="qtd" >
                </div>
            </div>
            <div class="password">
                <div class="passbox">
                    <label for="pass">Senha?</label>
                    <input type="checkbox" id="pass" @input="passChoice = !passChoice">
                </div>
                <Transition name="passwordTransition">
                    <input type="text" name="passChoice" class="password-input" v-if="passChoice" v-model="password">
                </Transition>
            </div>
            <div class="submit">
                <input type="button" value="Escolher Videos" @click="showAlgo = true">
                <ButtonSpecial btnProps="Criar Sala"></ButtonSpecial>
            </div>
        </form>

    </div>
  </div>
</template>

<script>
import ButtonSpecial from '../../components/buttonSpecial.vue'
import TabbleContainer from '../../components/tabbleVideosList.vue'
import axios from "axios"
import Erro from '../../components/erro.vue'
export default {
    name: '',
    beforeMount(){
        let token = localStorage.getItem('token')
        axios.post(`${this.$config.dev_url}validate`, {}, {headers:{authorization:'bearer ' + token}}).then(res => {
            axios.get(`${this.$config.dev_url}videos`,{headers:{authorization:'bearer ' + token}}).then(res => {
                this.videos = res.data.videos
                console.log(this.videos)
            }).catch(err => {
                console.log(err)
            })

        }).catch(err => {
            console.log(err)
        })
    },
    data() {
        return {
            name: '',
            qtd: 1,
            passChoice: false,
            inBetween10And20: false,
            password: '',
            videos: [],
            videosAdded: [],
            showAlgo: false,
            erro: '',
        }
    },
    components: { 
        ButtonSpecial,
        TabbleContainer,
        Erro
    },
    watch:{
        name(value, payload){
            this.name.length > 33 ? this.name = payload : this.name = value
        },
        qtd(value, payload) {
            value == '' ? this.inBetween10And20 = false : this.inBetween10And20
            isNaN(value) ? this.qtd = payload : this.qtd = value
            payload == 1 && value.split('')[1] != 1 && !this.inBetween10And20 ? this.qtd = value.split('')[1] : this.qtd = this.qtd // comentar o porque da escolha
            /* parseInt(payload >= 10) ? this.qtd = value : this.qtd = this.qtd */
            payload == 1 && value == 11 ? this.inBetween10And20 = true : this.qtd = this.qtd
            this.qtd == '' ? this.qtd = 1  : this.qtd = this.qtd
            parseInt(value) > 50 ? this.qtd = 50 : this.qtd = this.qtd
            parseInt(value) < 1 ? this.qtd = 1 : this.qtd = this.qtd
        
        },
        inBetween10And20(value, payload) {
            console.log('true')
            this.qtd = 1
        }
    },
    methods: {
        preventSubmit(e) {
            e.preventDefault()
        },
        filter(e) {
            const value = document.querySelector('#maxMembers')
            if (e.data === ' ') {
                return this.qtd = value.value
                
            }
        },
        yes(){
            this.showAlgo = false
        },
        close() {
            this.showAlgo = false
        },
        addOrRemoveVideo(event){
            event.target.innerHTML === "Selecionar" ?  event.target.innerHTML ='Cancelar' : event.target.innerHTML = 'Selecionar'
            event.target.classList.toggle('selected')
            event.target.previousElementSibling.classList.toggle('selected')
            let isInArray = this.checkIfVideoIsInArray(event.video._id)
            isInArray ? this.RemoveVideoFromArray(event.video._id) : this.addVideoInArray(event.video)
            console.log(this.videosAdded)
        },
        addVideoInArray(video) {
            this.videosAdded.push(video)
        },
        RemoveVideoFromArray(id) {
            let newArray = this.videosAdded.filter(video => {
                return id != video._id
            })
            this.videosAdded = newArray
        },
        checkIfVideoIsInArray(id){
            let found = this.videosAdded.find(video => {
                return id === video._id
            })
            return found
        },
        sendRoomData(){
            let token = localStorage.getItem('token')
            this.erro = ""
            axios.post('http://localhost:3333/room', { 
                password: this.password,
                passChoice: this.passChoice, 
                roomName:this.name, 
                filesVideos: this.videosAdded, 
                maxMembers: this.qtd, 
                type: 'upload'
                }, {headers:{authorization: 'bearer ' + token}})
                .then(res => {
                    let URL = res.data.param.url
                    this.$router.push({name:'watch-uploads-roomId', params: {roomId: URL}})
                }).catch(err => {
                    this.erro = err.response.data.err
                })
        }
    },
}
</script>

<style scoped>
    #creating{
        flex: 1;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container {
        width: 100%;
        max-width: 700px;
        background-color: var(--corMenu);
        border-top-right-radius: 10%;
        padding: 0px;
    }
    .container-1 {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 12px;
    }
    .name {
        width: 50%;
        min-width: 250px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin: 20px 0px;

    }
    .name input {
        width: 100%;
    }
    .membersNumber {
        width: 50%;
        min-width: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .membersNumber input {
        width: 30px;
        height: 25px;
        margin: 10px;
    }
    .password {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 70px;
    }
    .passbox {
        display: flex;

    }
    .password input {
        width: 100%;
        max-width: 500px;
    }
    .passwordTransition-enter-active {
        transition: 1s;
    }
    .passwordTransition-enter {
        width: 0% !important;
    }
    .passwordTransition-enter-to {
        width: 100%;
    }
    form {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    input {
    background-color: white;
    padding: 3px 5px;
    margin: 5px 2px;
    outline: none;
    border-radius: 5px;
    font-family: cursive;
    font-size: 1em;
    color: var(--cor1);
    }
    label {
        font-family: cursive;
        color: var(--cor2);
    }
    .container-box-poop {
    width: 106%;
    height: 100vh;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.24);
    position: absolute;
}
.warn-container{
  width: 100%;
  max-width: 600px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: var(--cor7);
  border-radius: 25px;
  
}
.warn-container h2 {
    font-family: cursive;
    color: var(--cor2);
}
.btn-container {
    width: 100%;
    height: 50px;
    max-width: 300px;
    display: flex;
    justify-content: space-around;
    pointer-events: none;
}
.yes{
    padding: 10px 30px;
    background-color: var(--cor5);
    font-family: cursive;
    color: wheat;
    border-radius: 10px;
    cursor: pointer;
    pointer-events: all;
}
.no{
    padding: 10px 30px;
    background-color: var(--cor4);
    font-family: cursive;
    color: wheat;
    border-radius: 10px;
    cursor: pointer;
    pointer-events: all;
}

</style>