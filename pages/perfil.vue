<template>
  <div class="perfil" @teste="console.log('tese')">
    <div class="areYouSure" v-if="showAlgo" @ask="showAlgo = true">
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
                <img v-else :src="user.profileimg">

            </div>
        <!--<input type="file" value="mudar imagem de perfil" v-if="!changing">-->
            <button class="edit-btn" v-if="!changing" @click="sendFile">Mudar Avatar</button>
            <input type="file" id="btn-file" @change="choiceImg">
            <button class="edit-btn" v-if="changing" @click="cancel">Cancelar</button>
            <button class="edit-btn" v-if="changing" @click="save">Salvar</button>
        </div>
        <div class="edit">
            <span v-if="errName != ''">{{errName}}</span>
            <span v-if="errEmail != ''">{{errEmail}}</span>
            <span v-if="errPassword != ''">{{errPassword}}</span>
            <div class="name">
                <div class="label-container">
                    <label>Nome</label>
                </div>
                <div class="icon-container">
                    <fa class="icon" icon="pen-to-square" @click="editInput('userName')"/>
                </div>
                <input type="text" disabled :placeholder="user.userName" id="userName" v-model="newUserName">
                <div class="confirm-container">
                    <fa class="icon" icon="check" v-if="saveUserName" @click="editName()"></fa>
                    <fa class="icon" icon="xmark" v-if="saveUserName"></fa>
                </div>
            </div>
            <div class="email">
                <div class="label-container">
                    <label>Email</label>
                </div>
                <div class="icon-container">
                    <fa class="icon" icon="pen-to-square" @click="editInput('email')"/>
                </div>
                <input type="email" disabled v-model="newEmail" :placeholder="user.email" id="email">
                 <div class="confirm-container">
                    <fa class="icon" icon="check" v-if="saveEmail" @click="editEmail()"></fa>
                    <fa class="icon" icon="xmark" v-if="saveEmail"></fa>
                 </div>
            </div>
            <div class="password">
                <div class="label-container">
                    <label>Senha</label>
                </div>
                <div class="icon-container">
                    <fa class="icon" icon="pen-to-square" @click="editInput('password')"/>
                </div>
                <input type="password" disabled v-model="newPassword" :placeholder="password" id="password">
                 <div class="confirm-container">
                    <fa class="icon" icon="check" v-if="savePassword" @click="editPassword()"></fa>
                    <fa class="icon" icon="xmark" v-if="savePassword"></fa>
                 </div>
            </div>
        </div>
        <div class="videos">
            <NuxtLink class="videos-btn" to="/perfil/videos">Seus Videos</NuxtLink>
        </div>
        <div class="special-btns">
            <LinkSpecial :UrlProps="'/users/' + this.user.id" :btnProps="'Ver Perfil Publico'" v-if="!loanding"></LinkSpecial>
            <div class="button-sign-out-container" @mouseenter="showIcon = true" @mouseleave="showIcon = false">
                <button class="button-sign-out" @click="REMOVE_TOKEN(), signOut()">
                    <Transition name="leave">
                        <span class="sign-out" v-if="!showIcon">Sair</span>
                    </Transition>
                   <Transition name="iconSignOut">
                       <fa icon="arrow-right-from-bracket" v-if="showIcon"></fa> 
                   </Transition>
                </button>
            </div>
        </div>
    </div>
    <NuxtChild ref="userVideos" class="coisa" @question="sendQuestion($event)"/>
  </div>
</template>

<script>
import axios from 'axios'
import {mapState, mapActions, mapMutations} from 'vuex'

export default {
    fetch(){
        console.log('tokennnnnnnnn', this.$cookies.get('token'))
         this.$store.dispatch('user/validateUser', this.$cookies.get('token')).then(res => {
            console.log('o user', res)
            this.$store.commit('user/SET_USER_INFO', res)             
            console.log('agr virou promise com then', res)
         }).catch(err => {
            console.log('console do erro por virar primisse com then', err)
         })/*-------------------------------------- isso é interessante, por alguma razão, eu não conseguia setar os headers caso
     ey recarregasse a pagina, usando esse código que é o mesmo que está no action, se eu tentar setar o header, seja pelo auth
     ou por asyncData ou até mesmo fetch, ele não irá ser setado, a menos que eu navegue de forma spa, nesse caso o header é setado
     sem nenhum problema de qualquer forma, mas se eu recarregar a pagina, não funciona.
     bueno, missão para você meu eu do futuro


     ---- seu eu do futuro de 30 minutos falando, https://nuxtjs.org/docs/features/data-fetching
     depois de um tempo eu percebia que o axios fazia 2 requests, mas apenas quando eu recarregava a pagina, a primeira não setava
     o headers, mas a segunda sim, então fiquei testando vendo se estava multiplicado em algum lugar o código, e não, depois de pesquisar
     vi essa opção "fetchOnServer", que ao meu entender, faria o fetch apenas funcionar no lado do cliente quando setado falso lol,
     fiz essa suposição pelo nome e a descrição, mas mais pelo nome
     
     --- porém ainda não entendo o porque quando tento setar headers pelo lado do servidor, não funciona
     */
    },
    fetchOnServer: false,
    name:'',
    /* beforeMount(){
        console.log(this.$store.state.localStorage.token)
        let token = localStorage.getItem('token')
        this.token = token
        axios.post('http://localhost:3333/validate', {}, {headers:{authorization: 'bearer ' + token}}).then(response => {
            const id = response.data.dates.id
            this.id = id
            console.log(response.data.dates)
            axios.get('http://localhost:3333/user/' + id).then(response => {
                console.log(response, 'eae')
                const {username, email, profileimg} = response.data.user[0]
                this.userName = username,
                this.email = email
                this.SrcImg = profileimg

            }).catch(response => {
                this.err = response.data.response.err
            })
            this.loanding = false

        }).catch(response => { 

        })
    }, */
    mounted(){
        this.loanding = false
        console.log(this.$store.state.user)
    },
    middleware: ['auth'],
    data(){
        return {
            id: this.$store.state.user.id,
            SrcImg: '',
            changing: false,
            password: '************',
            imgChoiced: undefined,
            imgUpload: undefined,
            newUserName: '',
            newEmail: undefined,
            newPassword: undefined,
            errName: '',
            errEmail: '',
            errPassword: '',
            loanding: true,
            showAlgo: false,
            saveUserName: false,
            saveEmail: false,
            savePassword: false,
            showIcon: false,
            deleteVideo: {}


        }
    },
    computed:{
        ...mapState({
            user: state => state.user
        }),
    },
    watch:{
        newUserName(value, payload){
            if (value != this.userName && value != '') {
                this.saveUserName = true
            }
            else {
                this.saveUserName = false
            }
        },
        newEmail(value, payload){
            console.log(value)
            if (value != this.email && value != '') {
                this.saveEmail = true
                
            }
            else {
                this.saveEmail = false
            }
        },
        newPassword(value, payload){
            if (value != '') {
                this.savePassword = true
                
            }
            else {
                this.savePassword = false
            }
        }
    },
    methods: {
        ...mapMutations({REMOVE_TOKEN: 'user/REMOVE_TOKEN', SET_USER_INFO:'user/SET_USER_INFO', SET_TOKEN: 'user/SET_TOKEN'}),
        ...mapActions({
                getToken: 'user/getToken', editUserName: 'user/editUserName', 
                validateUser:'user/validateUser', editImg: 'user/editImg',
                editUserEmail: 'user/editUserEmail', editUserPassword: 'user/editUserPassword'
                }),
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
            if (file.files.length > 0) {
                this.imgChoiced = URL.createObjectURL(this.imgUpload)
            }
            else {
                this.changing = false
            }
        },
        save() {
            let token = this.$cookies.get('token')
            this.validateUser(token).then(user => {
                let axiosInfos = {
                    token: token,
                    imagem: this.imgUpload,
                    email: user.email
                }
                this.editImg(axiosInfos).then(token => {
                    this.changing = false
                    this.SET_TOKEN('bearer ' + token)
                    this.validateUser(this.$cookies.get('token')).then(user => {
                        console.log('o usuario q estou a receber lol', user)
                        this.SET_USER_INFO(user)
                    }).catch(res => {
                        console.log('a resposta do erro lol', res)
                    })

                }).catch(res => {
                    console.log('o erro lol ', res)
                })

            })
            
        },
        cancel() {
            this.imgChoiced = undefined
            this.changing = false
        },
        editInput(input){
            let inputTargeted
            input === 'userName' ? inputTargeted = document.getElementById('userName') : inputTargeted

            input === 'email' ? inputTargeted = document.getElementById('email') : inputTargeted

            input === 'password' ? inputTargeted = document.getElementById('password') : inputTargeted 

            inputTargeted.removeAttribute('disabled')
            inputTargeted.focus()       
        },
        editName(){
            this.validateUser(this.$cookies.get('token')).then(res => {
                let axiosInfos = {
                token: this.$cookies.get('token'),
                userName: this.newUserName,
                email: res.email,
            }
                this.editUserName(axiosInfos).then(token => {
                    console.log('é o token', token)
                    this.SET_TOKEN('bearer ' + token)
                    this.validateUser(this.$cookies.get('token')).then(user => {
                        this.SET_USER_INFO(user)
                        this.newUserName = undefined
                        
                    }).catch(err => {
                        console.log('como tratar esse erro?', err)
                    })
                }).catch(err => {
                    console.log('o erro', err)
                    this.errName = err
                })
            }).catch(erro => {

            })
            
        },
        editEmail(){
             this.validateUser(this.$cookies.get('token')).then(user => {
                let axiosInfos = {
                token: this.$cookies.get('token'),
                email: user.email,
                newEmail: this.newEmail,
            }
                this.editUserEmail(axiosInfos).then(token => {
                    console.log('é o token', token)
                    this.SET_TOKEN('bearer ' + token)
                    this.validateUser(this.$cookies.get('token')).then(user => {
                        this.SET_USER_INFO(user)
                        this.newEmail = undefined
                    }).catch(err => {
                        console.log('como tratar esse erro?', err)
                    })
                }).catch(err => {
                    console.log('o erro', err)
                    this.errName = err
                })
            }).catch(erro => {

            })
        },
        editPassword(){
             this.validateUser(this.$cookies.get('token')).then(user => {
                let axiosInfos = {
                token: this.$cookies.get('token'),
                email: user.email,
                password: this.newPassword,
            }
                this.editUserPasswordl(axiosInfos).then(token => {
                    console.log('é o token', token)
                    this.SET_TOKEN('bearer ' + token)
                    this.validateUser(this.$cookies.get('token')).then(user => {
                        this.SET_USER_INFO(user)
                        this.newPassword = undefined
                    }).catch(err => {
                        console.log('como tratar esse erro?', err)
                    })
                }).catch(err => {
                    console.log('o erro', err)
                    this.errName = err
                })
            }).catch(erro => {

            })
        },
        signOut(){
            this.REMOVE_TOKEN()
            this.$router.push('/')
        },
        GoToPublicProfile(){
            
            
        },
        sendQuestion($event){
            this.showAlgo = true
            this.deleteVideo = $event.video
            console.log(this.deleteVideo)
        },
        close(){
            this.showAlgo = false
            this.deleteVideo =  {}
        },
        yes(){
           let token = this.$cookies.get('token')
           this.$store.dispatch('user/deleteVideo', {token: token, video: this.deleteVideo}).then(res => {
            console.log('resposta do apagar', res)
            this.$store.dispatch('user/getSetVideos', this.$cookies.get('token')).then(res => {
                console.log('deu certo?', res)
                this.showAlgo = false
            }).catch(err => {
                console.log('o erro da atualização em tempo real', err)
            })
           }).catch(naofoi => {
            console.log(naofoi,' nao foi')
           })
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
        justify-content: space-around;
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
    input:disabled {
        cursor:not-allowed;
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
    .confirm-container {
        width: 80px;
    }
    .label-container {
     border-right: 2px solid white;
     width: 63px;
     text-align: center;
    }
    .password .label-container {
        text-align: start;
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
}
.yes{
    padding: 10px 30px;
    background-color: var(--cor5);
    font-family: cursive;
    color: wheat;
    border-radius: 10px;
    cursor: pointer;
}
.no{
    padding: 10px 30px;
    background-color: var(--cor4);
    font-family: cursive;
    color: wheat;
    border-radius: 10px;
    cursor: pointer;
}
.special-btns {
    width: 100%;
    position: relative;
}
.special-btns a, .button-sign-out-container {
    position: absolute;
    width: 49%;
    transform: translateY(10px);
}
.special-btns a {
    left: 0;
}
.button-sign-out-container {
    right: 0;
}
.button-sign-out {
    width: 100%;
    min-height: 39px;
    background-color: var(--cor5);
    padding: 8px 0px;
    font-family: cursive;
    color: white;
    text-align: center;
    position: relative;
}
.button-sign-out svg, span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.iconSignOut-enter-active,.leave-enter-active, .iconSignOut-leave-active {
    transition: 0.4s;
}
.iconSignOut-leave-active, .leave-leave-active {
    transition: 0.1s;
}
.iconSignOut-enter {
    top: 101% !important;
    opacity: 0 !important ;
}
.iconSignOut-enter-to {
    top: 50% !important;
    opacity: 1 !important;
}
.iconSignOut-leave-to {
    top: 101% !important;
    opacity: 0;
}
.leave-enter {
    top: -1%;
    opacity: 0;
}
.leave-enter-to {
    top: 50%;
    opacity: 1;
}
.leave-leave-to {
    top: -1%;
    opacity: 0;
}
</style>