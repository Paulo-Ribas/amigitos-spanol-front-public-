<template>
    <div class="Sign">
        <div class="erro" v-if="erro != ''">
            {{erro}}
        </div>
        <form @submit="sendUser">
            <h2>Cadastre-se</h2>
            <label>Nome</label>
            <input type="text" v-model="name">
            <label>Email</label>
            <input type="email" v-model="email">
            <label>Senha</label>
            <input type="password" v-model="password">
            <input type="submit" value="Enviar" @click="sendUser">
        </form>
    </div>
  
</template>

<script>
import axios from "axios";
export default {
    name: 'qe',
    head(){
        return {
            title: 'sign-up',
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
            erro: ''
        }
    },
    methods: {
        sendUser($event) {
            $event.preventDefault()
            const {name, email, password} = this
            axios.post('http://localhost:3333/user',{username: name, email, password}).then(sucefful => {
                console.log('foi')
                this.$router.push({name: 'login'})
            }).catch(err => {
                this.erro = err.response.data.err
            })
            
        }
    },
    layout: 'noMenu'
}
</script>

<style scoped>
    .Sign {
        flex: 1;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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

    .erro {
        width: 99%;
        max-width: 800px;    
        background-color: var(--cor5);
        position: absolute;
        border-radius: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 5%;
        height: 40px;
        color: white;
        font-size: 1.2em;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    h2 {
    position: absolute;
    font-family: cursive;
    font-size: 1.8em;
    color: var(--cor2);
    top: 0;
    transform: translateY(-60px);
}


</style>
