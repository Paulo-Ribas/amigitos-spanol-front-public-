<template>
    <button id="btn-special" @click="clicked"> {{ btnValue }}</button>
</template>

<script>
export default {
    data() {
        return {
            btnValue: this.$props.btnProps
        }
    },
    props: {
        btnProps: String
    },
    watch:{
        btnProps(value, preload){
            this.btnValue = this.$props.btnProps
        },
    },
    methods: {
        clicked() {
            this.$emit('clicked')
        }
    }
}
</script>

<style scoped>
#btn-special {
    padding: 12px 0px;
    min-height: 39px;
    width: 100%;
    font-family: cursive;
    color: white;
    text-align: center;
    background-color: var(--cor4);
    display: block;
    text-decoration: none;
}
</style>