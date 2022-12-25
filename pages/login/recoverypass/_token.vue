<template>
    <div class="recovery">
        <Erro :erroProps="err" v-if="err != ''"></Erro>
        <Sucess :sucessProps="sucess" v-if="sucess != ''"></Sucess>
        <TardisLoadBig v-if="sucess != ''" class="tardis"></TardisLoadBig>
        <form v-if="sucess === ''">
            <label for="email">Email</label>
            <input type="email" v-model="email" id="email" name="email" placeholder="Digite Seu Email">
            <label>Senha</label>
            <input type="password" v-model="password" id="password" placeholder="Digite Sua Nova Senha">
            <label>Confirmar Senha</label>
            <input type="password" v-model="confirmPassword" name="password" id="password-verify" placeholder="Digite Sua Senha Novamente">
            <input type="submit" value="Enviar" @click="sendEmail">
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
            email: '',
            password:'',
            confirmPassword: '',
            token: this.$route.params.token,
            sucess: '',
        }
    },
    methods: {
        sendEmail(e){
            e.preventDefault()
            if (this.password !== this.confirmPassword) {
                this.err = "senhas não coincidem"
                return
            }

            this.$store.dispatch('user/changePasswordByToken',{email: this.email, password: this.confirmPassword, token: this.token}).then(done => {
                console.log(done)
                this.sucess = "senha alterada com sucesso"
                setTimeout(() => {
                    this.$router.push({name:'login'})
                }, 3000);
            }).catch(err => {
                this.err = err.response.data.err
            })
        }
    }
}
</script>

<style scoped>
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