<template>
  <div class="rules-container">
    <div class="rules-info">
        <p>{{ruleSelectedInfo}}</p>
        <ul>
            <li class="rulesTypes" @click="selected(1)">1</li>
            <li class="rulesTypes" @click="selected(2)">2</li>
            <li class="rulesTypes" @click="selected(3)">3</li>
        </ul>
    </div>
    <ButtonSpecial btnProps="Selecionar" @clicked="btnClicked"/>
  </div>
</template>

<script>
export default {
    data(){
        return {
            ruleSelectedInfo: '',
            ruleSelected: 0,
        }
    },
    methods: {
        selected($event){
            let explications = {
                _1: 'todos são livres para enviar videos ou muda-los eles sem aviso com ou sem permissão prévia, sistema de admistração funciona normalmente',
                _2: 'todos são livres para enviar videos ou muda-los contanto que o dono ou admistradores permitam, ou tenha sido concedida tal permissão, sistema de admistração funciona normalmente',
                _3: 'apenas o dono, admistrador ou quem tem permissão de enviar ou mudar videos podem executar tal ação ',
            }
            this.ruleSelected = $event
            $event === 1 ? this.ruleSelectedInfo = explications._1 
            : $event === 2 ? this.ruleSelectedInfo = explications._2 
            : $event === 3 ? this.ruleSelectedInfo = explications._3 
            : this.ruleSelectedInfo = ''  
        },
        btnClicked(){
            if(this.ruleSelected) return this.$emit('ruleSelected', {ruleType: this.ruleSelected})
            else this.$emit('error', {err: 'selecione uma das 3 regras'})
        },
    }
}
</script>

<style scoped>
    .rules-container {
        width: 100%;
        height: 100%;
        max-height: 500px;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
    }
    .rules-info {
        display: flex;
        flex: 1;
    }
    .rules-info p {
        width: 70%;
        min-width: 200px;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .rules-info ul {
        display: flex;
        height: 100%;
        width: 30%;
        min-width: 50px;
        flex-direction: column;
    }
    .rules-info li {
        font-family: cursive;
        font-size: 1.6em;
        color: white;
        height: 30px;
        margin: 5px 0px;
        width: 100%;
    }
</style>