<template>
  <div class="controls" @keydown="keysEvents" @mouseup="stopAllDraggings" @mousemove="draggingBar($event), draggingVolume($event)">
    <div class="progress" @click.stop="aprenderMatematica($event)"  @mousedown="setDragging($event,'bar')" draggable="false">
      <div class="progress-bar"  draggable="false"></div>
      <div class="progress-bar-drag" v-show="IsDraggingBar" draggable="false"></div>
    </div>
    <div class="container-btns">
      <div class="btn-primary">
        <img src="/svg/botao_play_.svg" class="play-pause-icon" @click="PlayPauseVideo">
        <div class="timer">{{currentTime}} / {{duration}}</div>
        <div class="volume-container">
            <img src="/svg/com_som.svg" @click="emitMuteUnmute()" class="volume-icon">
           <div class="volume" @mousedown="setDragging($event, 'volume')" @click="setVolume($event)" @mousemove="draggingVolume($event)" @mouseleave="stopDraggingVolume" @touchend="stopDraggingVolume">
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
            duration: this.durationProps,
            clicado: false,
            IsDraggingBar: false,
            isDraggingVolume: false,
        }
    },
    props: {
        time: String,
        durationProps: String
    },
    watch:{
        time(value, payload){
            if(value === null) return
            this.currentTime = value
        },
        durationProps(value, payload) {
            this.duration = value
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
            let width = $event.offsetX || $event.touches[0].offsetX
            let volumeBar = document.getElementById('volume-bar')
            if(width / 100 <= 0) return this.$emit('setVolume', 0)
            if(width / 100 >= 1) return this.$emit('setVolume', 1)
            volumeBar.style.width = `${width}%`
            let volume = width / 100
            this.$emit('setVolume', volume)
        },
        setDragging(event, drag) {
            if(drag === 'bar') {
                this.IsDraggingBar = true
                this.draggingBar(event)
            }
            if(drag === 'volume') {
                this.isDraggingVolume = true
                this.draggingVolume(event)
            }
        },
        addMovimentListener() {
            let volumeContainer = document.querySelector('.volume')
            volumeContainer.addEventListener('mousemove', this.moveVolumeBar)
        },
        draggingBar($event){
            if(this.IsDraggingBar){
                this.stopUserSelect()
                this.$emit('setProgressBarWidth', $event)
            }
        },
        draggingVolume($event){
            if(this.isDraggingVolume) {
                this.setVolume($event)
            }
        },
        stopUserSelect(){
            let timer = document.querySelector('.timer')
            let imgs = document.querySelectorAll('img')
            let svgs = document.querySelectorAll('svg')
            if(timer) timer.style.userSelect = 'none'
            imgs.forEach(img => {
                if(!img) return
                img.style.userSelect = 'none'
            })
            svgs.forEach(svg => {
                if(!svg) return 
                svg.style.userSelect = 'none'
            })
        },
        stopAllDraggings($event){
            this.isDraggingVolume = false
            this.IsDraggingBar = false
            let timer = document.querySelector('.timer')
            timer.style.userSelect = 'auto'


        },
        stopDraggingVolume($event){
            this.isDraggingVolume = false
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
        z-index: 4;
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
        z-index: 3;
        transition: 0.3s;
        pointer-events: none;
        cursor: pointer;
    }
    .progress-bar-drag {
        height: 100%;
        position: absolute;
        width: 0%;
        background-color: var(--cor5);
        z-index: 4;
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