<template>
  <div class="controls" @keydown="keysEvents">
    <div class="progress"  @mousedown="aprenderMatematica" draggable="false">
      <div class="progress-bar" @mousedown="aprenderMatematica" draggable="false"></div>
    </div>
    <div class="container-btns">
      <div class="btn-primary">
        <img src="/svg/botao_play_.svg" class="play-pause-icon" @click="PlayPauseVideo">
        <div class="timer">{{currentTime}}</div>
        <div class="volume-container">
            <img src="/svg/com_som.svg" @click="emitMuteUnmute()" class="volume-icon">
            <input type="range" value="100" max="100" min="0" class="volume" @change="setVolume"/>
        </div>
      </div>
      <div class="btn-fudno">
        <img src="/svg/tela_cheia.svg" class="fullScreem-icon" @click="fullScreamToggle">
      </div>
    </div>
  </div>
</template>

<script>
export default {
     mounted(){
        let controls = document.querySelector('.controls')
        let MouseVerify = function VerifyMouse() {
                let timeOut = setTimeout(() => {
                    try {
                        controls.classList.add('opacity0')
                    } catch (error) {
                        throw error    
                    }
                }, 7000);
                return timeOut
        }
        let interval = setInterval(() => {
            MouseVerify()
        }, 7000);
        document.querySelector('.video-container-mobile').addEventListener('click',() => {
                try {
                    controls.classList.remove('opacity0')
                } catch (error) {
                    throw error
                }
                clearInterval(MouseVerify)
            })
        window.addEventListener('beforeunload', ()=> {
            return clearInterval(interval)
         })
    },
    data(){
        return {
            currentTime: this.$props.time,
        }
    },
    props: {
        time: String
    },
    watch:{
        time(value, payload){
            if (value === null) return
            this.currentTime = value
        }
    },
    methods: {
        PlayPauseVideo($event){
            this.$emit('PlayPauseVideo', $event)
            console.log('evento emitido')
        },
        mouseSegura($event){
            this.$emit('mouseSegura', $event)
        },
        setVolume($event){
            this.$emit('setVolume', $event)
        },
        aprenderMatematica($event){
            this.$emit('aprenderMatematica', $event)
        },
        keysEvents($event){
            this.$emit('keysEvents', $event)
        },
        fullScreamToggle($event){
            this.$emit('fullScreamToggle', $event)
        },
        emitMuteUnmute(){
            this.$emit('muteUnmute')
        }

    }
}
</script>

<style>
    .controls {
        width: 100%;
        height: 44px;
        z-index: 2;
        color: white;
        position: absolute;
        bottom: 0;
        display: flex;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.342);
    }
    .progress {
        width: 100%;
        background-color: var(--cor2);
        height: 8px;
        position: relative;
        cursor: pointer;
    }
    .progress-bar {
        height: 100%;
        position: absolute;
        width: 1%;
        background-color: var(--cor4);
        z-index: 2;
        pointer-events: none;
        cursor: pointer;
    }
    .container-btns {
        width: 100%;
        height: calc(100% - 8px);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .btn-primary {
        display: flex;
        align-items: center;
        margin-left: 6px;
    
    }
    .btn-primary img {
        margin: 0px 2px;
    }
    img {
        height: 22px;
        width: 22px;
        cursor: pointer;
    }
    .volume-container {
        display: flex;
    }
    .play-pause-icon {
        height: 18px;
    }
    .fullScreem-icon {
        width: 43px;
        height: 43px;
    }
    .volume-container input {
        width: 75px;
    }

</style>