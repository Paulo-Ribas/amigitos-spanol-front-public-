<template>
    <div class="user">
    <TardisLoadBig v-if="loading"></TardisLoadBig>
        <div class="user-container" v-if="!loading">
            <div class="img-container">
                <img :src="imgSrc">
            </div>
            <div class="name-container">
                <h2>{{name}}</h2><span v-if="emoji != 'false'" v-html="emoji"></span>
            </div>
            <div class="friends">
               Amigos: {{friends}}
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'',
    fetch(){
        axios.get(`${this.$config.dev_url}user/${this.$route.params.userId}`).then(dates => {
            this.name = dates.data.user[0].username
            this.emoji = dates.data.user[0].emoji
            console.log(dates, 'teste')
            if (dates.data.user[0].profileimg.split('.')[0] === 'default') {
                this.imgSrc = 'default.png'
            }
            else {
                this.imgSrc = dates.data.user[0].profileimg
            }

        }).catch(err => console.log(err))
    },
    fetchOnServer: false,
    mounted(){
        this.loading = false
    },
    data(){
        return {
            name: '',
            imgSrc: '',
            emoji: '',
            friends: 0,
            loading: true,

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