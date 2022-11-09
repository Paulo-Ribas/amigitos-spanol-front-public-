<template>
    <div class="recovery">
        <Erro :erroProps="err" v-if="err != ''"></Erro>
        <form>
            <label>Email</label>
            <input type="email" id="email" placeholder="Digite Seu Email Para A Recuperação">
            <input type="submit" value="Enviar" @click="sendEmail">
        </form>
    </div>
  
</template>

<script>
export default {
    layout: 'noMenu',
    data(){
        return {
            err: ''
        }
    },
    methods: {
        sendEmail(e){
            e.preventDefault()
            let email = document.getElementById('email').value
            this.$store.dispatch('user/sendRecoveryToken',email).then(done => {}).catch(err => {
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

</style>