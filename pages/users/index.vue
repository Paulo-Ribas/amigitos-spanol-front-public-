<template>

</template>

<script>

export default {
    name:'',
    fetch(){
        this.$store.dispatch('user/validateUser', this.$cookies.get('token')).then(data => {
            this.$router.push(`/users/${data.id}`)
        }).catch(err => {   
             console.log(err)
        })
    },
    fetchOnServer: false,
    data(){
        return {
            name: '',
            imgSrc: '',
            emoji: '',
            friends: 0,



        }
    },
    
}
</script>

<style scoped>
    .user {
        flex: 1;
        height: 100vh;
        widows: 100%;
    }
    .user-container {
        width: 100%;
        max-width: 1000px;
        height: 140px;
        background-color: var(--cor7);
        display: flex;
        align-items: center;
        padding: 0px 10px;
        margin: 30px auto;
        border-radius: 10px;
        flex-wrap: wrap;
        position: relative;
    }
    .img-container {
        width: 100%;
        max-width: 180px;
        height: 180px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 15px;
        transform: translate(0px, -16px);
    }
    .friends {
        position: absolute;
        right: 5%;
        bottom: 5%;
        font-size: 1.2em;
        font-family: cursive;
        color: white;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    
    }
    h2 {
        color: white;
        transform: translate(0px, -10px);
    }


</style>