<template>
  <div class="perfil"> 
    <Erro v-if="errImg != ''" :erroProps="errImg"></Erro>
    <div class="areYouSure" v-if="showAlgo" @ask="showAlgo = true">
      <div class="warn-container">
        <h2>Tem Certeza?</h2>
        <div class="btn-container">
            <button class="yes" @click="yes">Sim</button>
            <button class="no" @click="close">Não</button>
        </div>
      </div>
    </div>
    <TardisLoadBig v-if="loanding"></TardisLoadBig>
    <div class="user-config" v-if="!loanding && !mobile">
        <div class="user-img">
            <div class="img-container">
                <img v-if="imgChoiced" :src="imgChoiced">
                <img v-else :src="user.profileimg">
                <TardisLoadSmall v-if="imgUploading"></TardisLoadSmall>
            </div>
        <!--<input type="file" value="mudar imagem de perfil" v-if="!changing">-->
            <button class="edit-btn" v-if="!changing" @click="sendFile">Mudar Avatar</button>
            <input type="file" accept="image/png,image/jpeg,image/jpg" id="btn-file" @change="choiceImg">
            <button class="edit-btn" v-if="changing" @click="cancel">Cancelar</button>
            <button class="edit-btn" v-if="changing" @click="save">Salvar</button>
        </div>
        <div class="edit">
            <div class="name">
                <span v-if="errName != ''">{{errName}}</span>
                <div class="label-container">
                    <label>Nome</label>
                </div>
                <div class="icon-container">
                    <fa class="icon" icon="pen-to-square" @click="editInput('userName')"/>
                </div>
                <input type="text" disabled :placeholder="user.userName" id="userName" v-model="newUserName">
                <div class="confirm-container">
                    <fa class="icon" icon="check" v-if="saveUserName" @click="editName()"></fa>
                    <fa class="icon" icon="xmark" v-if="saveUserName" @click="cancelEditInput('userName')"></fa>
                </div>
            </div>
            <div class="email">
                <span v-if="errEmail != ''">{{errEmail}}</span>
                <div class="label-container">
                    <label>Email</label>
                </div>
                <div class="icon-container">
                    <fa class="icon" icon="pen-to-square" @click="editInput('email')"/>
                </div>
                <input type="email" disabled v-model="newEmail" :placeholder="user.email" id="email">
                 <div class="confirm-container">
                    <fa class="icon" icon="check" v-if="saveEmail" @click="editEmail()"></fa>
                    <fa class="icon" icon="xmark" v-if="saveEmail" @click="cancelEditInput('email')"></fa>
                 </div>
            </div>
            <div class="password">
                <span v-if="errPassword != ''">{{errPassword}}</span>
                <div class="label-container">
                    <label>Senha</label>
                </div>
                <div class="icon-container">
                    <fa class="icon" icon="pen-to-square" @click="editInput('password')"/>
                </div>
                <input type="password" disabled v-model="newPassword" :placeholder="password" id="password">
                 <div class="confirm-container">
                    <fa class="icon" icon="check" v-if="savePassword" @click="editPassword()"></fa>
                    <fa class="icon" icon="xmark" v-if="savePassword" @click="cancelEditInput('password')"></fa>
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
    <NuxtChild ref="userVideos" class="coisa" @verify="verifyMobile" @toggleMobile="toggleMobile" @question="sendQuestion($event)"/>
  </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'

export default {
    fetch(){
        this.setState()
    },
    fetchOnServer: false,
    name:'',
    beforeMount(){
        this.verifyMobile()

    },
    mounted(){
        this.loanding = false
         
    },
    middleware: ['auth'],
    head(){
        return {
            title: 'perfil',
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
    data(){
        return {
            id: this.$store.state.user.id,
            SrcImg: '',
            changing: false,
            password: '************',
            imgChoiced: undefined,
            imgUpload: undefined,
            newUserName: '',
            imgUploading: false,
            newEmail: undefined,
            newPassword: undefined,
            errName: '',
            errEmail: '',
            errPassword: '',
            errImg: '',
            loanding: true,
            showAlgo: false,
            saveUserName: false,
            saveEmail: false,
            savePassword: false,
            showIcon: false,
            deleteVideo: {},
            mobile: false,


        }
    },
    computed:{
        ...mapState({
            user: state => state.user
        }),
        mq(){
            return this.$mq
        }
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
        verifyMobile(){
             
            if (this.$route.fullPath === '/perfil/videos' && this.$mq === 'sm') {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        },
        toggleMobile(){
            this.mobile ? this.mobile = false : this.mobile = true
        },
        ...mapMutations({REMOVE_TOKEN: 'user/REMOVE_TOKEN', SET_USER_INFO:'user/SET_USER_INFO', SET_TOKEN: 'user/SET_TOKEN'}),
        ...mapActions({
                getToken: 'user/getToken', editUserName: 'user/editUserName', 
                validateUser:'user/validateUser', editImg: 'user/editImg',
                editUserEmail: 'user/editUserEmail', editUserPassword: 'user/editUserPassword',
                setState: 'user/setState'
                }),
        sendFile(){
            let fileBtn = document.getElementById('btn-file')
            fileBtn.click()
        },
        choiceImg() {
            let form = new FormData()
            const file = document.getElementById('btn-file')
            form.append('imagem',file.files[0])
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
                this.imgUploading = true
                this.editImg(axiosInfos).then(token => {
                    this.changing = false
                    this.SET_TOKEN('bearer ' + token)
                    this.validateUser(this.$cookies.get('token')).then(user => {
                         
                        this.SET_USER_INFO(user)
                        this.imgUploading = false
                        this.errImg = ''
                    }).catch(res => {
                          

                        this.imgUploading = false
                        this.errImg = res.err
                    })

                }).catch(res => {
                     

                    this.imgUploading = false
                    this.errImg = res.err
                     
                })

            })
            
        },
        cancel() {
            this.imgChoiced = undefined
            this.changing = false
            this.imgUploading = false
        },
        editInput(input){
            let inputTargeted
            input === 'userName' ? inputTargeted = document.getElementById('userName') : inputTargeted

            input === 'email' ? inputTargeted = document.getElementById('email') : inputTargeted

            input === 'password' ? inputTargeted = document.getElementById('password') : inputTargeted 

            inputTargeted.toggleAttribute('disabled')
            inputTargeted.focus()       
        },
        cancelEditInput(input){
            switch (input) {
                case 'userName':
                    document.getElementById('userName').value = null
                    this.saveUserName = false
                    this.errName = ''
                    break;
                case 'email':
                    document.getElementById('email').value = null
                    this.saveEmail = false
                    this.errEmail = ''
                    break;
            
                case 'password':
                    document.getElementById('password').value = '************'
                    this.savePassword = false
                    this.errPassword = ''
                    break;
            }
            this.editInput(input)
        },
        editName(){
            this.validateUser(this.$cookies.get('token')).then(res => {
                let axiosInfos = {
                token: this.$cookies.get('token'),
                userName: this.newUserName,
                email: res.email,
            }
                this.editUserName(axiosInfos).then(token => {
                     
                    this.SET_TOKEN('bearer ' + token)
                    this.validateUser(this.$cookies.get('token')).then(user => {
                        this.SET_USER_INFO(user)
                        this.errName = ''
                        this.newUserName = ''
                        this.saveUserName = false
                        this.editInput('userName')
                        
                    }).catch(err => {
                        this.errName = err.err
                        throw err
                    })
                }).catch(err => {
                    this.errName = err.err
                    throw err
                })
            }).catch(err => {
                this.errName = err.err
                throw err
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
                     
                    this.SET_TOKEN('bearer ' + token)
                    this.validateUser(this.$cookies.get('token')).then(user => {
                        this.SET_USER_INFO(user)
                        this.errEmail = ''
                        this.newEmail = ''
                        this.saveEmail = false
                        this.editInput('email')

                    }).catch(err => {
                        this.errEmail = err
                        throw err
                    })
                }).catch(err => {
                    this.errEmail = err.err
                    throw err
                })
            }).catch(err => {
                this.errEmail = err.err
                throw err
            })
        },
        editPassword(){
             this.validateUser(this.$cookies.get('token')).then(user => {
                let axiosInfos = {
                token: this.$cookies.get('token'),
                email: user.email,
                password: this.newPassword,
            }
                this.editUserPassword(axiosInfos).then(token => {
                    this.SET_TOKEN('bearer ' + token)
                    this.validateUser(this.$cookies.get('token')).then(user => {
                        this.SET_USER_INFO(user)
                        this.errPassword = ''
                        this.newPassword = ''
                        this.savePassword = false
                        this.editInput('password')
                    }).catch(err => {
                        this.errPassword = err.err
                        throw err
                    })
                }).catch(err => {
                    this.errPassword = err.err
                    throw err
                })
            }).catch(err => {
                this.errPassword = err.err
                throw err
            })
        },
        async signOut(){
            this.REMOVE_TOKEN()
            this.$router.push('/')
        },
        sendQuestion($event){
            this.showAlgo = true
            this.deleteVideo = $event.video
             
        },
        close(){
            this.showAlgo = false
            this.deleteVideo =  {}
        },
        yes(){
           let token = this.$cookies.get('token')
           this.$store.dispatch('user/deleteVideo', {token: token, video: this.deleteVideo}).then(res => {
             
            this.$store.dispatch('user/getSetVideos', this.$cookies.get('token')).then(res => {
                 
                this.showAlgo = false
            }).catch(err => {
                 
            })
           }).catch(naofoi => {
             
           })
        }
    }
}
</script>

<style scoped>
    .perfil {
        flex: 1;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        overflow: auto;
    }
    .user-config {
        flex: 1;
        max-width: 500px;
        min-width: 360px;
        margin: 0px 20px;
        background-color: var(--corMenu);
        border-radius: 10px;
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
        object-fit: cover;
    }
    .edit {
        width: 100%;
    }
    .edit span {
        position: absolute;
        top: -6px;
        color: var(--cor9);
        white-space: nowrap;
    }
    .name, .email, .password {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 10px 0px;
        justify-content: space-around;
        position: relative;
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
  width: 98%;
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
    color: white;
    border-radius: 10px;
    cursor: pointer;
}
.no{
    padding: 10px 30px;
    background-color: var(--cor4);
    font-family: cursive;
    color: white;
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
@media screen and (max-width: 400px) {
    .user-config {
        flex: 1;
        max-width: 500px;
        min-width: 340px;
        margin: 0px 0px;
        background-color: var(--corMenu);
        border-radius: 10px;
    }
}
</style>