<template>
    <div class="erro">
        {{erro}}
     </div>
</template>

<script>
export default {
    name: '',
    data(){
        return {
            erro: this.$props.erroProps
        }
    },
    props: {
        erroProps: String,
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
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
</style>