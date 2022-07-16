<template>
  <div class="controls" @keydown="keysEvents">
    <div class="progress" @click="aprenderMatematica" @mousedown="mouseSegura">
      <div class="progress-bar"></div>
    </div>
    <div class="container-btns">
      <div class="btn-primary">
        <button @click="PlayPauseVideo">Play/Pause</button>
        <input type="range" value="100" max="100" min="0" class="volume" @change="setVolume"/>
      </div>
      <div class="btn-fudno">
        <button @click="fullScream">Tela Cheia</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name:"controles",
    data(){
        return {

        }
    },
    methods:{
       addFocus(){
            const video = document.getElementById('video')
            video.classList.add('focus')
        },
        PlayPauseVideo(){
            const video = document.getElementById('video')
            console.log(video.duration, video.currentTime)
            if (video.paused) {
                video.play()
            }
            else {
                video.pause()
            }
        },
        showObject($event){
            console.log($event)
        },
        GaloFilhoDaPuta(){
            const video = document.getElementById('video')
            const barra = document.querySelector('.progress-bar')
            barra.style.width = `${video.currentTime / video.duration * 100}%`
        },
        keysEvents(key){
            const video = document.getElementById('video')
            console.log(key)
            if (key.code === 'Space') {
                this.PlayPauseVideo()
            } 
            if (key.code === 'ArrowRight') {
                this.skip5Seconds()
                    
            }
            if (key.code === 'ArrowLeft') {
                this.return5Seconds()
            }
        },
        setVolume(){
            const video = document.getElementById('video')
            const volumeValue = parseInt(document.querySelector('.volume').value)
            video.volume = (volumeValue / 100)
        },
        skip5Seconds(){
            const video = document.getElementById('video')

            video.currentTime = video.currentTime + 5
        },
        return5Seconds(){
            const video = document.getElementById('video')

            video.currentTime = video.currentTime - 5
        },
        aprenderMatematica($event){
            const video = document.getElementById('video')
            let position = ($event.offsetX / $event.target.offsetWidth) * video.duration
            video.currentTime = position
            

        },
        mouseSegura(){
            const progress = document.querySelector('.progress')
            progress.classList.add('focus')
        },
        mouseEventHandler($event){
            const progress = document.querySelector('.progress')
            if (progress.classList.contains('focus')) {
                console.log('funcão')
                const video = document.getElementById('video')
                let position = ($event.offsetX / $event.target.offsetWidth) * video.duration
                video.currentTime = position
                const barra = document.querySelector('.progress-bar')
                barra.style.width = `${video.currentTime / video.duration * 100}%`
                
            }
        },
        fullScream() {
            const video = document.querySelector('.video-container')
            video.requestFullscreen()
        }

    }
};
</script>

<style scoped>
    .controls {
        width: 100%;
        height: 38px;
        z-index: 2;
        color: white;
        position: absolute;
        bottom: 0;
        display: flex;
        flex-direction: column;
    }
    .progress {
        width: 100%;
        background-color: var(--cor2);
        height: 8px;
        position: relative;
    }
    .progress-bar {
        height: 100%;
        position: absolute;
        width: 1%;
        background-color: var(--cor4);
        z-index: 2;
        pointer-events: none;
    }
    .container-btns {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
</style>