<template>
  <div class="videos-container">
    <div class="video-box-container">
        <div class="video-box" data-video-box v-for="video in videos" :key="video._id" @click="setVideoPicked(video), definePinkClass($event)">
            <div class="video-img">
                <img :src="user.profileimg" alt="img logo">
            </div>
            <div class="video-name"><h3>{{video.fileName}}</h3></div>
        </div>
    </div>
        <div class="confirm-container">
            <div class="icon-container" v-if="selected">
                <fa icon="check" @click="choiceVideo()"></fa>
                <fa icon="xmark" @click="cancel()"></fa>
            </div>
        </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data(){
        return {
            videos:this.$props.videosProps,
            selected: false, 
            videoPicked: undefined,

        }
    },
    props:{
        videosProps: Array
    },
    computed:{
        ...mapState({
            user: state => state.user
        })
    },
    methods:{
        definePinkClass(event){
            const videos = document.querySelectorAll('.video-box')
            let videoSelected
            event.target.hasAttribute('data-video-box') ? videoSelected = event.target : videoSelected = event.target.parentElement
            videoSelected.classList.add('pink-border')
            videos.forEach(video => {
                console.log(videoSelected === video)
                if (video != videoSelected) {
                    video.classList.remove('pink-border')
                }
            })

        },
        setVideoPicked(video){
            console.log('video set picked', video)
            this.selected = true
            this.videoPicked = video

        },
        choiceVideo(){
            this.$emit('ChangeVideo', this.videoPicked)
        },
        cancel(){
            this.selected = false
            this.videoPicked = {}
            const videos = document.querySelectorAll('.video-box')
            videos.forEach(video => {
                video.classList.remove('pink-border')
            })
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
        z-index: 6;

    }
    .video-box-container {
        width: 99%;
        max-width: 1280px;
        margin: 10px 0px;
        height: 200px;
        border: 7px solid var(--corMenu);
        background: var(--scrollColor);
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: auto
    }
    .video-box {
        max-width: 350px;
        min-width: 300px;
        border-radius: 20px;
        flex: 1;
        /* height: 160px; */
        min-height: 160px;
        height: 88%;
        max-height: 200px;
        margin: 0px 10px;
        background-color: var(--cor4);
        cursor: pointer;
        padding: 6px 0px;
        border: 3px solid var(--corMenuMobile);
        transition: 0.1s;
        word-break: break-word;
    }
    .video-box:hover {
        border: 3px solid var(--cor6);
    }
    .video-box:hover .video-name {
        color: var(--cor2);
    }
    .video-img {
        height: 70%;
        width: 100%;
        position: relative;
    }
    .video-img img {
        width: 100%;
        height: 100%;
        position: absolute;
        object-fit: contain;
        pointer-events: none;
    }
    .video-name {
        display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
    height: 30%;
    color: black;
    text-shadow: 0px 0px 6px var(--corAzul);
    pointer-events: none;
    }
    .name {
        font-family: cursive;
        word-break: break-all;
        font-size: 1em;
        pointer-events: none;
    }
    .pink-border {
        border: 3px solid var(--cor6);
    }
    .confirm-container {
        width: 99%;
        max-width: 1280px;
        display: flex;
        justify-content: flex-end;

    }
    .icon-container {
        padding-right: 30px;
    }
    .icon-container svg {
        font-size: 1.5em;
        color: white;
        margin: 0px 5px;
        cursor: pointer;
    }
    @media screen and (max-width: 740px)  {
        .videos-container {
            width: 100%;
            height: 100vh;
            background-color: #011031ce;
            display: flex;
            align-items: center;
            flex-direction: column;
            position: absolute;
            z-index: 6;
        }
        .video-box-container {
            width: 99%;
            max-width: 1280px;
            margin: 0px 0px; 
            height: 100%;
            border: none;
            background: var(--scrollColor);
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-wrap: nowrap;
            overflow-x: auto;
        }
        .video-box {
                border-radius: 20px;
                min-width: 300px;
                max-width: none;
            flex: 1;
    /* height: 160px; */
            min-height: 180px;
    /* height: 88%; */
            width: 100%;
            max-height: 200px;
            margin: 10px 0px;
            background-color: var(--cor4);
            cursor: pointer;
            padding: 6px 0px;
            border: 3px solid var(--corMenuMobile);
            transition: 0.1s;
            word-break: break-word;
        }
        .confirm-container {
            width: 99%;
            max-width: 1280px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .icon-container {
            padding-right: 0px;
        }
    }
</style>