<template>
  <div class="videos-container">
    <div class="video-box-container">
        <div class="video-box" data-video-box v-for="video in videos" :key="video._id" @click="setVideoPicked(video), definePinkClass($event)">
            <div class="video-img">
                <img src="/default.png" alt="">
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
export default {
    mounted(){
        console.log(this.videos)
    },
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
        width: 110%;
        height: 100vh;
        position: absolute;
        background-color: var(--corMenu);
        z-index: 4;
        display: flex;
        align-items: center;
        flex-direction: column;

    }
    .video-box-container {
        width: 99%;
        max-width: 1280px;
        margin: 10px 0px;
        height: 200px;
        border: 2px solid var(--corMenu);
        background-color: var();
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: auto;
    }
    .video-box {
        max-width: 350px;
        width: 100%;
        min-width: 300px;
        height: 160px;
        margin: 0px 10px;
        background-color: var(--cor4);
        cursor: pointer;
        padding: 6px 0px;
        border: 3px solid var(--cor1);
        transition: 0.1s;
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
        color: var(--cor7) ;
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
</style>