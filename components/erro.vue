<template>
    <div class="erro">
        {{erro}}
     </div>
</template>

<script>
export default {
    data(){
        return {
            erro: this.$props.erroProps
        }
    },
    props: {
        erroProps: String,
    },
    watch:{
        erroProps(value, payload){
            this.erro = value
        }
    }

}
</script>

<style scoped>
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
        font-family: cursive,'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
    }
</style>