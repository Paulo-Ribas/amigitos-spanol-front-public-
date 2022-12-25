<template>
  <span> <fa icon="check"></fa> {{msg}}</span>
</template>

<script>
export default {
    data(){
        return {
            msg: this.$props.sucessProps
        }
    },
    props:{
        sucessProps: String
    }
}
</script>

<style scoped>
    span {
        color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-family: cursive;
        font-size: 1.3em;
    }
</style>