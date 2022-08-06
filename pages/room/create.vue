<template>
  <div id="creating">
    <div class="container">
        <form @submit="preventSubmit($event)">
            <div class="container-1">
                <div class="name">
                    <label>Nome Da Sala:</label>
                    <input type="text" name="roomName" v-model="name">
                </div>
                <div class="membersNumber">
                    <label>max membros:</label>
                    <input type="text" id="maxMembers" v-model="qtd" @input="filter($event)">
                </div>
            </div>
            <div class="password">
                <div class="passbox">
                    <label for="pass">Senha?</label>
                    <input type="checkbox" id="pass" @input="passChoice = !passChoice">
                </div>
                <Transition name="passwordTransition">
                    <input type="text" name="passChoice" class="password-input" v-if="passChoice">
                </Transition>
            </div>
            <div class="submit">
                <ButtonSpecial btnProps="Criar Sala"></ButtonSpecial>
            </div>
        </form>

    </div>
  </div>
</template>

<script>
import ButtonSpecial from '../../components/buttonSpecial.vue'
export default {
    name: '',
    data() {
        return {
            name: '',
            qtd: 1,
            passChoice: false,
            password: ''
        }
    },
    components: { 
        ButtonSpecial
    },
    watch:{
        name(value, payload){
            this.name.length > 33 ? this.name = payload : this.name = value
        },
        qtd(value, payload) {
            isNaN(value) ? this.qtd = payload : this.qtd = value
            if (!isNaN) {
                this.value = '' ? this.qtd = 1 : this.qtd = payload
                parseInt(this.qtd) > 50 ? this.qtd = 50 : this.qtd = value
                parseInt(this.qtd) < 1 ? this.qtd = 1 : this.qtd = value
            }
        },
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

</style>