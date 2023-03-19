<template>
    <div class="box-container-yt-request">
        <div clalss="youtube-video-dates">
            <h2 class="youtube-name">
                {{videoName}}
            </h2>
            <div class="videoImg">
                <img :src="videoImg">
            </div>
        </div>
        <div class="user-request-info">
            <p>pedido feito por: <span class="name">{{userRequestName}}</span></p>
        </div>
        <div class="btn-container">
            <button @click="acceptRequest()">Aceitar</button> <button @click="rejectRequest()">Rejeitar</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    created(){
        console.log(this.requestInfo)
         axios.get(`https://www.youtube.com/oembed?url=${this.requestInfo.video}&format=json`).then(video=> {
                    this.videoImg = video.data.thumbnail_url
                    this.videoName = video.data.title
         }).catch(err => {
            console.log(err)
         })
    },
    mounted(){
        this.userRequestName = this.requestInfo.userName
        console.log(this.requestInfo, 'informação')
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
            console.log(value, 'valor do coisa')

        },
    },
    methods: {
        acceptRequest(){
            let videoInfo = {
                requestInfo: this.requestInfo,
                id: this.id
            }
            console.log(this.requestInfo, 'request info clicado', videoInfo, this.videoInfo2)
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
    .box-container-yt-request{
        width: 100%;
        height: 100%;
        max-width: 300px;
        max-height: 400px;
        position: absolute;
        z-index: 7;
        display: flex;
        flex-direction: column;
    }
    .youtube-video-dates, .user-request-info, .btn-container {
        width: 100%,
    } 
</style>