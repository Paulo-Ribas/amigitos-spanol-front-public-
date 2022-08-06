<template>
  <div class="perfil" @teste="console.log('tese')">
    <div class="areYouSure" v-if="showAlgo" @ask="showAlgo = true" @click="close">
      <div class="warn-container">
        <h2>Tem Certeza?</h2>
        <div class="btn-container">
            <button class="yes" @click="yes">Sim</button>
            <button class="no" @click="close">Não</button>
        </div>
      </div>
    </div>
    <div class="tardis" v-if="loanding">
        <img src="/loanding1.gif">
    </div>
    <div class="user-config" v-if="!loanding">
        <div class="user-img">
            <div class="img-container">
                <img v-if="imgChoiced" :src="imgChoiced">
                <img v-else :src="SrcImg">

            </div>
        <!--<input type="file" value="mudar imagem de perfil" v-if="!changing">-->
            <button class="edit-btn" v-if="!changing" @click="sendFile">Mudar Avatar</button>
            <input type="file" id="btn-file" @change="choiceImg">
            <button class="edit-btn" v-if="changing" @click="cancel">Cancelar</button>
            <button class="edit-btn" v-if="changing" @click="save">Salvar</button>
        </div>
        <div class="edit">
            <span v-if="errName">{{errName}}</span>
            <span v-if="errEmail">{{errEmail}}</span>
            <span v-if="errPassword">{{errPassword}}</span>
            <div class="name">
                <label>Nome | </label><fa class="icon" icon="house" @click="editName"/>
                <input type="text" :placeholder="username" v-model="newUserName">
            </div>
            <div class="email">
                <label>Email |</label><fa class="icon" icon="house" @click="editEmail"/>
                <input type="email" :placeholder="email">
            </div>
            <div class="password">
                <label>Senha | </label><fa class="icon" icon="house" @click="editPassword"/>
                <input type="password" :placeholder="password">
            </div>
        </div>
        <div class="videos">
            <NuxtLink class="videos-btn" to="/perfil/videos">Seus Videos</NuxtLink>
        </div>

    </div>
    <NuxtChild ref="userVideos" class="coisa" @question="sendQuestion"/>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'',
    beforeMount(){
        let token = localStorage.getItem('token')
        this.token = token
        axios.post('http://localhost:3333/validate', {}, {headers:{authorization: 'bearer ' + token}}).then(response => {
            const id = response.data.dates.id
            this.id = id
            console.log(response.data.dates)
            axios.get('http://localhost:3333/user/' + id).then(response => {
                console.log(response, 'eae')
                const {username, email, profileimg} = response.data.user[0]
                this.username = username,
                this.email = email
                this.SrcImg = profileimg

            }).catch(response => {
                this.err = response.data.response.err
            })
            this.loanding = false

        }).catch(response => { 

        })
    },
    data(){
        return {
            SrcImgOriginal: '',
            SrcImg: '',
            changing: false,
            username: '',
            email: '',
            password: '************',
            id: 0,
            imgChoiced: undefined,
            imgUpload: undefined,
            token: undefined,
            newUserName: undefined,
            newEmail: undefined,
            newPassword: undefined,
            errName: undefined,
            errEmail: undefined,
            errPassword: undefined,
            loanding: true,
            showAlgo: false

        }
    },
    methods: {
        sendFile(){
            let fileBtn = document.getElementById('btn-file')
            fileBtn.click()
        },
        choiceImg() {
            let form = new FormData()
            const file = document.getElementById('btn-file')
            form.append('video',file.files[0])
            this.changing = true
            this.imgUpload = file.files[0]
            this.imgChoiced = URL.createObjectURL(this.imgUpload)
        },
        save() {
            let token = localStorage.getItem('token')
            axios.put('http://localhost:3333/profileImg', {imagem: this.imgUpload}, {headers: {
                "Content-Type": "multipart/form-data",
                authorization: 'bearer ' + token
            }}).then(foi => {
                console.log(foi)
            }).catch(erro => {
                console.log(erro)
            })
            this.changing = false
        },
        cancel() {
            this.imgChoiced = undefined
            this.changing = false
        },
        editName(){
            console.log(this.token)
            axios.put('http://localhost:3333/username', {username: this.newUserName}, {headers:{
                authorization: 'bearer ' + this.token
            }}).then(response =>{
                this.errName = undefined
            }).catch(response => {
                this.errName = response.data.response.err
            })
        },
        editEmail(){
             axios.put('http://localhost:3333/username', {username: this.newUserName}, {headers:{
                authorization: 'bearer ' + this.token
            }}).then(response =>{
                this.errEmail = undefined
            }).catch(response => {
                this.errEmail = response.data.response.err
            })
        },
        editPassword(){
             axios.put('http://localhost:3333/username', {username: this.newUserName}, {headers:{
                authorization: 'bearer ' + this.token
            }}).then(response =>{
                this.errPassword = undefined
            }).catch(response => {
                this.errPassword = response.data.response.err
            })
        },
        sendQuestion(){
            this.showAlgo = true
        },
        close(){
            this.showAlgo = false
        },
        yes(){
           this.$parent.$children[0].$refs.userVideos.deleteVideo()
        }
    }
}
</script>

<style scoped>
    .tardis {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 350px;
    }
    .tardis img {
        width: 300px;
        height: 350px;
    }
    .perfil {
        flex: 1;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
    .user-config {
        flex: 1;
        max-width: 500px;
        min-width: 300px;
        margin: 0px 20px;
        background-color: var(--corMenu);
    }
    .coisa {
        flex: 1;
        max-width: 500px;
        min-width: 300px;
        margin: 0px 20px;
        background-color: var(--corMenu);
        min-height: 396px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }
    .user-img {
        width: 100%;
        max-width: 500px;
        background-color: rgb(1 16 49 / 50%);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 30px;
        padding: 6px 1px;
    }
    .img-container {
        width: 100%;
        min-width: 140px;
        height: 140px;
        max-width: 140px;
        position: relative;
        overflow: hidden;
        border-radius: 50%;
        background-color: aliceblue;
        margin: 4px 30px;
    }
    img {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .edit {
        width: 100%;
    }
    .name, .email, .password {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 10px 0px;
    }
    label {
        margin: 0px 5px;
        font-size: 1.1em;
        color: white;
        font-family: cursive;

    }
    #btn-file {
        display: none;
    }
    input {
        width: 100%;
        max-width: 300px;
        background-color: white;
        padding: 3px 5px;
        margin: 5px 2px;
        outline: none;
        border-radius: 5px;
        font-family: cursive;
        font-size: 1em;
        color: var(--cor1);
    }
    .videos {
        width: 100%;
        margin-top: 30px;
    }
    .videos-btn {
        width: 100%;
        padding: 8px 0px;
        font-family: cursive;
        color: white;
        text-align: center;
        background-color: var(--cor4);
        display: block;
        text-decoration: none;
    }
    .icon {
        margin: 0px 3px;
        display: inline-block;
        color: white;
        cursor: pointer
    }
    .edit-btn {
        background-color: var(--cor3);
        font-family: cursive;
        color: white;
        padding: 10px;
        border-radius: 50px;
        font-size: 0.9em;
        margin: 0px 5px;
    }
.areYouSure {
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
  max-width: 400px;
  height: 300px;
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
}
.no{
    padding: 10px 30px;
    background-color: var(--cor4);
    font-family: cursive;
    color: wheat;
    border-radius: 10px;
}
</style>