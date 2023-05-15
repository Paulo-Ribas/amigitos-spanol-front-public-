<template>
    <div class="box-container-yt-request">
        <div class="youtube-video-dates">
            <div class="videoImg">
                <img :src="videoImg">
            </div>
            <h2 class="youtube-name">
                {{videoName}}
            </h2>
        </div>
        <div class="user-request-info">
            <p>pedido feito por: <span class="name">{{userRequestName}}</span></p>
        </div>
        <div class="btn-container">
            <button @click="acceptRequest()" class="accept">Aceitar</button> <button @click="rejectRequest()" class="refuse">Rejeitar</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    created(){
         
         axios.get(`https://www.youtube.com/oembed?url=${this.requestInfo.video}&format=json`).then(video=> {
                    this.videoImg = video.data.thumbnail_url
                    this.videoName = video.data.title
         }).catch(err => {
             
         })
    },
    mounted(){
        this.userRequestName = this.requestInfo.userName
         
        this.id = this.requestInfo.id
    },
    data(){
        return {
            requestInfo: this.$props.requestInfoProps,
            videoName: undefined,
            videoImg: undefined,
            userRequestName: '',
            id: undefined,
        }
    },
    props: {
        requestInfoProps: Object,
    },
    watch:{
        requestInfoProps(value, payload){
            this.requestInfo = value
             

        },
    },
    methods: {
        acceptRequest(){
            let videoInfo = {
                requestInfo: this.requestInfo,
                id: this.id
            }
             
            this.$emit('accepted', videoInfo )
        },
        rejectRequest(){
            let videoInfo = {
                requestInfo: this.requestInfo,
                id: this.id
            }
            this.$emit('rejected', videoInfo)
        }

    }
}
</script>

<style scoped>
    .box-container-yt-request {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--chatOpacity);
}
.youtube-video-dates{
    width: 90%;
    height: 100%;
    max-height: 415px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.youtube-name {
    color: white;
    font-family: cursive;
    margin: 5px 0px;
    text-shadow: 0px 0px 5px var(--cor7);
}
.videoImg{
    width: 90%;
    height: 90%;
    max-width: 400px;
    max-height: 300px;
    position: relative;
}
.videoImg img {
    width: 100%;
    height: 100%;
    position: absolute;
    object-fit: cover;
    object-position: center;
}

.user-request-info p {
    color: var(--cor9);
    text-decoration: underline;
    text-shadow: 0px 0px 1px var(--cor3),0px 0px 1px var(--cor3);
    font-family: cursive;
    margin-left: 10px;
}
.user-request-info{    
    width: 100%;
    max-width: 800px;
}
.btn-container {
    width: 100%;
    display: flex;
    justify-content: center;
    max-width: 800px;
    margin: 2px 0px;
}
.btn-container .accept {
    background-color: var(--corMenu);
    padding: 10px 15px;
    border-radius: 5px;
    /* border: 1px solid white; */
    color: white;
    font-family: cursive;
    margin: 0px 10px;
}
.btn-container .refuse {
    
    background-color: var(--cor6);
    padding: 10px 15px;
    border-radius: 5px;
    /* border: 1px solid white; */
    color: white;
    font-family: cursive;
    margin: 0px 10px;

}
    
</style>