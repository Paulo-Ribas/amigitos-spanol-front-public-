<template>
  <div class="controls" @keydown="keysEvents">
    <div class="progress" @click="setFalse(), aprenderMatematica($event)"  @mousedown="teste($event)" @mousemove="ultimoTeste($event)" @mouseleave="clicado = false" draggable="false">
      <div class="progress-bar"  draggable="false"></div>
    </div>
    <div class="container-btns">
      <div class="btn-primary">
        <img src="/svg/botao_play_.svg" class="play-pause-icon" @click="PlayPauseVideo">
        <div class="timer">{{currentTime}}</div>
        <div class="volume-container">
            <img src="/svg/com_som.svg" @click="emitMuteUnmute()" class="volume-icon">
           <div class="volume" @mousedown="setVolume($event), addMovimentListener()" @mouseup="removeMovimentListener()">
                <div id="volume-bar">
                    <div class="ball"></div>
                </div>
             </div>
        </div>
      </div>
      <div class="btn-fundo">
        <img src="/svg/tela_cheia.svg" class="fullScreem-icon" @click="fullScreamToggle">
        <fa icon ='masks-theater' @click="emitTheaterMode()" class="theater-icon"></fa>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    mounted(){
        let control = document.querySelector('.controls')
        let MouseVerify = function VerifyMouse() {
            let timeOut = setTimeout(() => {
                try {
                    control.classList.add('opacity0')
                            
                } catch (error) {
                         
                }   
            }, 7000);
            return timeOut
        }

        const interval = setInterval(() => {
            MouseVerify()
        }, 7000);

        document.querySelector('.youtube-VideoPlayer').addEventListener('mousemove',() => {
            try {
                control.classList.remove('opacity0')
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
            clicado: false,
        }
    },
    props: {
        time: String
    },
    watch:{
        time(value, payload){
            if(value === null) return
            this.currentTime = value
        }
    },
    methods: {
        PlayPauseVideo($event){
            this.$emit('PlayPauseVideo', $event)
             
        },
        mouseSegura($event){
            this.$emit('mouseSegura', $event)
        },
        setVolume($event) {
             
            let width = $event.offsetX
            let volumeBar = document.getElementById('volume-bar')
            volumeBar.style.width = `${width}%`
            let volume = width / 100
            this.$emit('setVolume', volume)
        },
        addMovimentListener() {
            let volumeContainer = document.querySelector('.volume')
            volumeContainer.addEventListener('mousemove', this.moveVolumeBar)
        },
        moveVolumeBar(element) {
            let volumeBar = document.getElementById('volume-bar')
            let width = element.offsetX
            volumeBar.style.width = `${width}%`
            let volume = width / 100

            this.$emit('setVolume', volume)

        },
        removeMovimentListener() {
            let volumeContainer = document.querySelector('.volume')
            volumeContainer.removeEventListener('mousemove', this.moveVolumeBar)
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
        },
        teste($event){
            if ($event.type === 'mousedown') {
                this.clicado = true
            }
            else {
                this.clicado = false
            }
        },
        emitTheaterMode(){
            this.$emit('theaterMode')
            this.fullScreamToggle()
        },
        ultimoTeste($event){
            if (this.clicado === true) {
                this.aprenderMatematica($event)
            }
             
        },
        setFalse(){
            this.clicado = false
        }

    }
}
</script>

<style scoped>
.opacity0 {
    opacity: 0 !important;
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
    .btn-fundo {
        height: 100%;
        display: flex;
        align-items: center;
    }
    img {
        height: 24px;
        width: 24px;
        cursor: pointer;
    }
    .volume-container {
        display: flex;
        align-items: center;
    }
    .play-pause-icon {
        height: 20px;
    }
    .fullScreem-icon {
        width: 45px;
        height: 45px;
    }
    .volume {
        width: 100px;
        height: 10px;
        background-color: var(--corMenu);
        position: relative;
        cursor: pointer;
        border-radius: 10px;
        margin: 0px 3px;
    }
    #volume-bar {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: var(--cor7);
        border-radius: 10px


    }
    .ball {
        width: 13.5px;
        height: 13.5px;
        border-radius: 50%;
        left: 100%;
        top: 50%;
        transform: translate(-75%,-50%);
        position: absolute;
        background-color: var(--cor4);
        pointer-events: none;
    }
    .theater-icon {
        font-size: 1.3em;
        margin-right: 4px;
        cursor: pointer;
    }

</style>