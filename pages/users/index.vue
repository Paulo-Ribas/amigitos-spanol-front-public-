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

</style>