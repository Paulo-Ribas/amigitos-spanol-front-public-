<template>
  <div class="mobile-controls-container" @click="toggleControll">
    <div class="controls-container" v-show="displayBlock">
        <div class="skip-container" @click="keysEvents('ArrowRight')">
            <img src="/svg/adiantar_o_video_.svg" class="skip-icon">
        </div>
        <img src="/svg/botao_play_.svg" class="play-pause-icon" @click="PlayPauseVideo">
        <div class="return-container" @click="keysEvents('ArrowLeft')">
            <img src="/svg/regressar_o_video_.svg" class="return-icon">
        </div>
    </div>
  <div class="controls" @keydown="keysEvents">
    <div class="progress"  @mousedown="aprenderMatematica" draggable="false">
      <div class="progress-bar" @mousedown="aprenderMatematica" draggable="false"></div>
    </div>
    <div class="container-btns">
      <div class="btn-primary">
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
    </div>
</template>

<script>
export default {
     mounted(){
        let controls = document.querySelector('.controls')
        let self = this
        let MouseVerify = function VerifyMouse() {
                let timeOut = setTimeout(function (){
                    try {
                        controls.classList.add('opacity0')
                        this.removeDisplayBlock()
                    } catch (error) {
                        throw error    
                    }
                }.bind(self), 7000);
                return timeOut
        }
        let interval = setInterval(() => {
            MouseVerify()
        }, 7000);
        document.querySelector('.youtube-VideoPlayer-mobile').addEventListener('click',function() {
                try {
                    controls.classList.remove('opacity0')
                    this.toggleControll()
                } catch (error) {
                    throw error
                }
                clearInterval(MouseVerify)
            }.bind(self))
        window.addEventListener('beforeunload', ()=> {
            return clearInterval(interval)
         })
    },
    data(){
        return {
            currentTime: this.$props.time,
            displayBlock:false,
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
            let event = {code:$event}
            console.log(event, $event, 'evento')
            this.$emit('keysEvents', event)
        },
        fullScreamToggle($event){
            this.$emit('fullScreamToggle', $event)
        },
        emitMuteUnmute(){
            this.$emit('muteUnmute')
        },
        toggleControll(){
            this.displayBlock = true
        },
        removeDisplayBlock(){
            this.displayBlock = false
        }

    }
}
</script>

<style scoped>
 .opacity0 {
    opacity: 0 !important;
 }
.mobile-controls-container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
}
    .controls-container {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        background-color: var(--corMenu);
    }
    .skip-container {
        width: 50%;
        height: 100%;
        position: absolute;
        z-index: 2;
        right: 0;
    }
    .return-container {
        width: 50%;
        height: 100%;
        position: absolute;
        z-index: 2;
        left: 0;
    }
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
        height: 10px;
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
    .play-pause-icon, .skip-icon, .return-icon {
        height: 42px;
        width: 42px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
    }
    .fullScreem-icon {
        width: 43px;
        height: 43px;
    }
    .volume-container input {
        width: 75px;
    }

</style>