<template>
  <div class="rules-container">
    <div class="rules-info">
        <p>{{ruleSelectedInfo}}</p>
        <ul>
            <li :class="{'selected': ruleSelected === 1, 'rulesTypes': true}" @click="selected(1)">1</li>
            <li :class="{'selected': ruleSelected === 2, 'rulesTypes': true}" @click="selected(2)">2</li>
            <li :class="{'selected': ruleSelected === 3, 'rulesTypes': true}" @click="selected(3)">3</li>
        </ul>
    </div>
    <BtnSpecial btnProps="Selecionar" @clicked="btnClicked"/>
  </div>
</template>

<script>
export default {
    props: {
        rulesProps: Number,
    },
    data(){
        return {
            ruleSelectedInfo: '',
            ruleSelected: this.$props.rulesProps,
        }
    },
    mounted(){
        this.selected(this.ruleSelected)
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
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
        background-color: var(--corMenu);
        border-top-right-radius: 10%;
        overflow: hidden;
        
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
        background-color: var(--corMenu);
        font-size: 1.2em;
        font-family: cursive;
        text-transform:capitalize;
        text-align: center;
        color: white;
        
        
    }
    .rules-info ul {
        display: flex;
        height: 100%;
        width: 30%;
        min-width: 50px;
        flex-direction: column;
        list-style: none;
        justify-content: space-evenly;
    }
    .rules-info li {
        font-family: cursive;
        font-size: 1.6em;
        color: white;
        width: 100%;
        text-align: center;
        border: 3px solid var(--cor7);
        display: flex;
        height: 33%;
        border-radius: 7px;
        justify-content: center;
        align-items: center;
        background-color: var(--cor3);
        cursor: pointer;
        transition: 0.3s;
    }
    .rules-info li:hover {
        font-family: cursive;
        font-size: 1.6em;
        color: var(--cor7);
        width: 100%;
        text-align: center;
        border: 3px solid var(--cor7);
        display: flex;
        height: 33%;
        border-radius: 7px;
        justify-content: center;
        align-items: center;
        background-color: var(--cor2);
        cursor: pointer;
        transform: scale(1.080);
    }
    .selected {
        font-family: cursive;
        font-size: 1.6em;
        color: var(--cor7) !important;
        width: 100%;
        text-align: center;
        border: 3px solid var(--cor7) !important;
        display: flex;
        height: 33%;
        border-radius: 7px;
        justify-content: center;
        align-items: center;
        background-color: var(--cor2) !important;
        cursor: pointer;
        transform: scale(1.080);
    }
    @media screen and (max-width: 420px) {
        ul {
            height: 70px !important;
            width: 100% !important;
            flex-direction: row !important;
        }
        .rules-info {
            flex-direction: column;
        }
        .rules-info p {
            width: 100%;
            height: 100%;
        }
        li {
            width: 33% !important;
            height: 100% !important;
        }
      
        
    }

</style>