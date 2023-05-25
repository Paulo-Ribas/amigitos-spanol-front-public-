<template>
  <button class="btn-special" @click="clicked"> {{btnValue}}</button>
</template>

<script>
export default {
    name: 'ButtonSpecial',
    data(){
        return {
            btnValue: this.$props.btnProps
        }
    },
    props: {
        btnProps: String
    },
    methods: {
        clicked(){
            this.$emit('clicked')
        }
    }
}
</script>

<style scoped>
    .btn-special{
    width: 100%;
    padding: 8px 0px;
    font-family: cursive;
    color: white;
    text-align: center;
    background-color: var(--cor4);
    display: block;
    text-decoration: none;
    }

</style>