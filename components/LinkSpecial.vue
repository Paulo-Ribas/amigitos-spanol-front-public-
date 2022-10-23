<template>
  <NuxtLink class="btn-special" :to="Url"> {{btnValue}}</NuxtLink>
</template>

<script>
export default {
    data(){
        return {
            btnValue: this.$props.btnProps,
            Url: this.$props.UrlProps
        }
    },
    props: {
        btnProps: String,
        UrlProps: String,
    },
    watch: {
        UrlProps(value, payload){
            this.Url = value
        },
        btnProps(value, payload){
            this.btnProps = value
        }
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