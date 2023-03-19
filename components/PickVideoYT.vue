<template>
  <div class="videos-container">
    <form class="input-container" @submit="requestVideoDatas($event)">
        <input type="url" placeholder="  Video Url..." :class="{'youtube-link-input':'youtube-link-input', 'showInput': showInput}" v-model="url">
        <button type="submit" @click="setShowInput">
            <fa icon="magnifying-glass"></fa>
        </button>
    </form>
    <div class="get-videos-data" v-if="dataSet">
        <div class="thumb">
            <img :src="thumb">
        </div>
        <div class="title">
            <h2>{{title}}</h2>
        </div>
    </div>
        <div class="confirm-container">
            <div class="icon-container">
                <fa icon="check" @click="choiceVideo()" v-if="selected"></fa>
                <fa icon="xmark" @click="cancel()"></fa>
            </div>
        </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
    mounted(){
        console.log(this.videos)
    },
    data(){
        return {
            url: '',
            dataSet: false,
            selected: false, 
            showInput:false,
            canMakeRequest: 0,
            videoPicked: undefined,
            thumb: '',
            title: ''

        }
    },
    watch: {
        url(){
            this.requestVideoDatas()
        }
    },
    methods:{
        requestVideoDatas(event){
            event ? event.preventDefault() : event = undefined
            if (this.canMakeRequest >= 1) {
                axios.get(`https://www.youtube.com/oembed?url=${this.url}&format=json`).then(video=> {
                    let embedSplit = video.data.html.split(' ')[3]
                    let embedUrl = embedSplit.split('"')[1]
                    this.videoPicked = embedUrl
                    this.thumb = video.data.thumbnail_url
                    this.title = video.data.title
                    this.dataSet = true
                    this.selected = true
                    console.log(embedUrl)
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        setShowInput(){
            this.showInput ? this.showInput = this.showInput : this.showInput = true
            this.canMakeRequest++
        },
        choiceVideo(){
            this.$emit('ChangeVideo', {embed: this.videoPicked, original: this.url})
        },
        cancel(){
            this.selected = false
            this.videoPicked = {}
            this.dataSet = false,
            this.showInput = false,
            this.canMakeRequest = 0
            this.$emit('cancel')

        }
    }
}
</script>

<style scoped>
    .videos-container{
        width: 100%;
        height: 100vh;
        background-color: #011031ce;
        display: flex;
        align-items: center;
        flex-direction: column;
        position: absolute;
        z-index: 3;

    }
    .input-container{
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .youtube-link-input {
        width: 0%;
        transition: 1s;
        height: 35px;
        background-color: white;
        color: var(--cor1);
        font-size: 1.1em;
        font-family: cursive;
        outline:none;
    }
    .showInput {
        width: calc(70% - 40px) !important;
        
    }
    .get-videos-data {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .title {
        width: 100%;
        max-width: 500px;
        text-align: center;
        font-family: cursive;
        color: var(--cor2);
    }
    .thumb {
        width: 100%;
        max-width:  600px;
        height: 320px;
        position: relative;
        margin: 20px 0px;
    }
    .thumb img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    button {
        width: 40px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: var(--cor3);
        justify-self: flex-end;

    }
    .confirm-container {
        width: 99%;
        max-width: 1280px;
        display: flex;
        justify-content: center;

    }
    .icon-container svg {
        font-size: 1.5em;
        color: white;
        margin: 25px 5px;
        cursor: pointer;
    }
    @media screen and (max-width: 760px)  {
        .showInput {
        width: calc(99% - 40px) !important;
        
    }
        
    }
</style>