<template>
  <button @click="emitClick($event)">{{btnValue}}</button>
</template>

<script>
export default {
    data(){
        return {
            btnValue: this.$props.btnProps
        }
    },
    props: {
        btnProps: String,
    },
    methods: {
        emitClick($event){
            this.$emit('clicked', $event)
        }
    }
}
</script>

<style scoped>
    button {
        font-family: cursive;
        padding: 20px 20px;
        width: 95%;
        max-width: 360px;
        color: var(--cor1);
        background: var(--corMenu);
        font-size: 1.2em;
        border-radius: 50px;
        cursor: pointer;
        box-shadow: 2px 2px 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    button:hover{
        box-shadow: 2px 2px 5px;
    }

</style>