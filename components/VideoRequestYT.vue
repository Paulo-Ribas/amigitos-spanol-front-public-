<template>
    <div class="box-container-yt-request">
        <div clalss="youtube-video-dates">
            <h2 class="youtube-name">
                {{videoName}}
            </h2>
            <div class="videoImg">
                {{videoImg}}
            </div>
        </div>
        <div class="user-request-info">
            <p>pedido feito por: <span class="name">{{userRequestName}}</span></p>
        </div>
        <div class="btn-container">
            <button @click="accept()">Aceitar</button> <button @click="reject()">Rejeitar</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    beforeMount(){
         axios.get(`https://www.youtube.com/oembed?url=${this.requestInfo.video.}&format=json`).then(video=> {
                    this.thumb = video.data.thumbnail_url
                    this.title = video.data.title
         }).catch(err => {
            console.log(err)
         })
    },
    data(){
        return {
            requestInfo: this.$props.requestInfoProps,
            videoName: undefined,
            videoImg: undefined
        }
    },
    props: {
        requestInfoProps: Object,
    },
    methods: {
        accept(){
            this.$emit('accepted', this.requestInfo)
        },
        reject(){
            this.$emit('rejected', this.requestInfo)
        }

    }
}
</script>

<style scoped>
    .box-container-yt-request{
        width: 100%;
        heigth: 100%;
        max-width: 300px;
        max-heigth: 400px;
        position: absolute;
        z-index: 7;
        display: flex;
        flex-direction: column;
    }
    .youtube-video-dates, .user-request-info, .btn-container {
        width: 100%,
    } 
</style>