<template>
    <div class="recovery">
        <Erro :erroProps="err" v-if="err != ''"></Erro>
        <Sucess :sucessProps="sucess" v-if="sucess != ''"></Sucess>
        <form v-if="sucess === ''">
            <label>Email</label>
            <input type="email" id="email" placeholder="Digite Seu Email Para A Recuperação">
            <input type="submit" value="Enviar" @click="sendEmail">
            <TardisLoadBig class="tardis" v-if="loadTardis && sucess === '' && err ===''"></TardisLoadBig>
        </form>
    </div>
  
</template>

<script>
export default {
    layout: 'noMenu',
    head(){
        return {
            title: 'recovery pass',
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
            err: '',
            sucess: '',
            loadTardis: false,
        }
    },
    methods: {
        sendEmail(e){
            e.preventDefault()
            let email = document.getElementById('email').value
            this.loadTardis = true
            this.$store.dispatch('user/sendRecoveryToken',email).then(done => {
                console.log(done)
                this.sucess = "Email Enviado Com Sucesso"
            }).catch(err => {
                this.err = err.response.data.err
            })
        }
    }
}
</script>

<style>
    .recovery {
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
        color: white;
    }
    label {
        font-family: cursive;
        font-size: 1.2em;
        color: white;
    }
    .tardis{
        transform: translate(-50%, calc(-50% - -150px));
    }

</style>