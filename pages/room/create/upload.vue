<template>
  <div id="creating">
    <Erro :erroProps="erro" v-if="erro != ''"></Erro>
    <div class="container-box-poop" v-show="showAlgo">
      <div class="warn-container">
        <h2>Selecione Os Videos</h2>
            <TabbleVideosList class="tableWarn" btnProps="Selecionar" :selectAllProps="true" :videosProps="videos" @selectedVideo="addOrRemoveVideo($event)" @selectAllVideos="addAllVideos()" @deselectAllVideos="removeAllVideos()"/>
        <div class="btn-container">
            <button class="yes" @click="yes">Pronto</button>
            <button class="no" @click="close">Cancelar</button>
        </div>
      </div>
    </div>
    <TardisLoadBig v-if="loading"></TardisLoadBig>
    <div class="container" v-if="!loading" v-show="!showAlgo">
        <Rules @ruleSelected="changeRulesType($event)" @error="erro = $event.err" v-if="changeRules"/>
        <fa icon="gears" class="icon-gear" @click="changeRules = !changeRules" v-if="!changeRules"></fa>
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
                <BtnSpecial btnProps="Criar Sala" class="create"></BtnSpecial>
            </div>
        </form>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TardisLoadBig from '../../../components/TardisLoadBig.vue'
export default {
    name: '',
    async asyncData(context){
    let videos = await context.app.store.dispatch('user/getSetVideos', context.$cookies.get('token'))
    return {
      videos: videos
    }
  },
    middleware:['auth'],
    mounted(){
        this.loading = false
    },
    head(){
        return {
            title: 'Criar Sala',
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
    data() {
        return {
            name: '',
            qtd: 1,
            passChoice: false,
            inBetween10And20: false,
            password: '',
            videos: this.$store.state.user.videos,
            videosAdded: [],
            showAlgo: false,
            erro: '',
            loading: true,
            changeRules: false,
            rulesType: 1,
        }
    },
    components: {
        TardisLoadBig 
    },
    watch:{
        name(value, payload){
            this.name.length > 33 ? this.name = payload : this.name = value
        },
        qtd(value, payload) {
             
            value === '' || value === undefined ? value = '0' : value
            value == '0' ? this.inBetween10And20 = false : this.inBetween10And20
            isNaN(value) ? this.qtd = value.replace(/[^0-9]/g, '') : this.qtd = value
            payload == 1 && value.split('')[1] != 1 && !this.inBetween10And20 ? this.qtd = value.split('')[1] : this.qtd = this.qtd // comentar o porque da escolha
            /* parseInt(payload >= 10) ? this.qtd = value : this.qtd = this.qtd */
            payload == 1 && value == 11 ? this.inBetween10And20 = true : this.qtd = this.qtd
            this.qtd == '' ? this.qtd = 1  : this.qtd = this.qtd
            parseInt(value) > 50 ? this.qtd = 50 : this.qtd = this.qtd
            parseInt(value) < 1 ? this.qtd = 1 : this.qtd = this.qtd
        
        },
        inBetween10And20(value, payload) {
             
            this.qtd = 1
        }
    },
    methods: {
        ...mapActions({postRoom: 'user/postRoom'}),
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
             
        },
        addVideoInArray(video) {
            this.videosAdded.push(video)
        },
        addAllVideos(){
            console.log('ADDDDDD TUDOOOOOO!!!!!!!!!!!!!!!!!!!!')
            this.videosAdded = this.videos
            let selecteds = document.querySelectorAll('tr')
            selecteds.forEach(selected => {
                selected.lastElementChild.innerHTML === "Cancelar" ? selected.lastElementChild.innerHTML = 'Selecionar' : selected.lastElementChild.innerHTML = 'Cancelar'
                selected.lastElementChild.classList.add('selected')
                selected.lastElementChild.previousElementSibling.classList.add('selected')
            })
        },
        removeAllVideos(){
            let selecteds = document.querySelectorAll('tr')
            selecteds.forEach(selected => {
                selected.lastElementChild.innerHTML === "Cancelar" ? selected.lastElementChild.innerHTML = 'Selecionar' : selected.lastElementChild.innerHTML = 'Cancelar'
                selected.lastElementChild.classList.remove('selected')
                selected.lastElementChild.previousElementSibling.classList.remove('selected')
            })
            this.videosAdded = []
        },
        changeRulesType(event) {
            this.changeRules = false
            this.rulesType = event.ruleType
             
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
            let token = this.$cookies.get('token')
            this.erro = ""
             
            let axiosConfig = {
                token: token,
                roomData: {
                    password: this.password,
                    passChoice: this.passChoice, 
                    roomName:this.name, 
                    filesVideos: this.videosAdded, 
                    maxMembers: this.qtd,
                    type: 'upload',
                    rulesType: this.rulesType, 
                } 
            }
            this.postRoom(axiosConfig).then(res => {
                 
                this.$router.push({name: 'watch-upload-roomId', params:{ roomId: res.url}})
            }).catch(err => {
                 
                this.erro = err
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
        position: relative;
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
    .container form {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .container input {
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
.submit input {
    margin: 20px auto;
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
.icon-gear {
    color: var(--cor3);
    font-size: 1.8em;
    position: absolute;
    right: 0;
    cursor: pointer;
    transition: 0.2s;
}
.icon-gear:hover {
    font-size: 2em;
}
@media screen and (max-width: 670px) {
    .container {
        width: 100%;
        max-width: 700px;
        background-color: var(--corMenu);
        border-top-right-radius: 10%;
        padding: 0px;
        height: 90vh;
    }
    .container-box-poop {
        width: 100%;
    }
    .container form {
        height: 100%;
        justify-content: space-evenly;
    }
    .password input {
        width: 90%;
    }
    .submit {
        padding: 0px 4%;
        display: flex;
        flex-direction: column;
    }
    .submit input {
        margin: 30px auto;
    }
    .create {
        border-radius: 10px;
    }
    .warn-container {
        height: 98%;
    }
    .tableWarn {
        max-height: 370px;
        margin: 10px 0px;
        max-width: 550px;
    }
    
    
}
</style>