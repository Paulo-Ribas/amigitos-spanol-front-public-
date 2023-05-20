<template>
    <div class="login">
        <Erro :erroProps="erro" v-if="erro != ''"></Erro>
        <form @submit="sendUser">
            <h2>Login</h2>
            <label>Nome</label>
            <input type="text" v-model="name">
            <label>Email</label>
            <input type="email" v-model="email">
            <label>Senha</label>
            <input type="password" v-model="password">
            <input type="submit" value="Enviar" @click="sendUser">
            <NuxtLink to="/login/recoverypass" class="recovery">esqueceu a senha?</NuxtLink>
        </form>
            <img src="/loanding1.gif" v-if="loanding" class="tardis-loanding">
    </div>
  
</template>

<script>
import axios from "axios";
export default {
    head(){
        return {
            title: 'Login',
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
            name: '',
            email: '',
            password: '',
            erro: '',
            loanding: false
        }
    },
    components: {
    },
    methods: {
        sendUser($event) {
            $event.preventDefault()
            const {name, email, password} = this.$data
            this.loanding = true
             
            axios.post(` 
https://www.amigitos-espanol-api.com.br/login`,{username: name, email, password}).then(sucefful => {
                let token = sucefful.data.token
                this.$store.commit('user/SET_TOKEN', 'bearer ' + token)
                this.$store.dispatch('user/validateUser', 'bearer ' + token).then(res => {
                    let id = res.id
                    this.$router.push({name: 'users-userId', params:{userId: id}})
                }).catch(err => {
                     
                })
            }).catch(err => {
                 
                this.erro = err.response.data.err
                this.loanding = false
            })
            
        }
    },
    layout: 'noMenu'
}
</script>

<style scoped>
    .login {
        flex: 1;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .recovery {
        color: white;
        font-family: cursive;
        font-size: 1em;
        margin-bottom: -23px;
        text-decoration-color: var(--corAzul);
    }
    form {
        width: 100%;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    input {
        width: 100%;
        max-width: 410px;
        background-color: var(--corMenu);
        padding: 7.5px 10px;
        margin: 10px 0px;
        color: white;
        font-size: 1em;
        outline: none;
        border-radius: 50px;
        font-family: cursive;
    }
    input[type="submit"] {
        max-width: 180px;
        padding: 10px 5px;
        border-radius: 50px;
    }
    label {
        font-family: cursive;
        font-size: 1.2em;
        color: white;
    }

h2 {
    position: absolute;
    font-family: cursive;
    font-size: 1.8em;
    color: var(--cor2);
    top: 0;
    transform: translateY(-60px);
}
.tardis-loanding {
    position: absolute;
    width: 40px;
    height: 50px;
    bottom: 10%;
}

</style>
