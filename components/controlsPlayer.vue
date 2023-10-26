<template>
<div class="controls-container" @click="PlayPauseVideo" @dblclick="fullScreamToggle" @mouseup="stopAllDraggings" @mousemove="draggingBar($event), draggingVolume($event)">
    <div class="show-eps" v-if="askQuestion" @click.stop="showList">
        <h3 draggable="false">Lista De Episódios</h3>
    </div>
    <div class="serie-ep-list-container" v-show="list">
        <div class="close" v-show="close">
            <fa icon="xmark" @click.stop="heigth0"></fa>
        </div>
            <SerieSeasonList :selectedTempProps="tempProps" :selectedEpProps="epProps"></SerieSeasonList>
    </div>
    <div class="controls" @keydown="keysEvents" @click.stop="">
    <div class="progress" @click.stop="setFalse(), aprenderMatematica($event)"  @mousedown="setDragging($event,'bar')" draggable="false">
      <div class="progress-bar" draggable="false"></div>
      <div class="progress-bar-drag" v-show="IsDraggingBar" draggable="false"></div>
    </div>
    <div class="container-btns">
      <div class="btn-primary">
        <img src="/svg/botao_play_.svg" class="play-pause-icon" @click="PlayPauseVideo">
        <div class="timer">{{currentTime}} / {{duration}}</div>
        <div class="volume-container">
            <img src="/svg/com_som.svg" @click="emitMuteUnmute()" class="volume-icon">
            <div class="volume" @mousedown="setDragging($event, 'volume')" @click="setVolume($event)" @mousemove="draggingVolume($event)">
                <div id="volume-bar">
                    <div class="ball"></div>
                </div>
            </div>
        </div>
      </div>
      <div class="btn-fundo">
        <img src="/svg/tela_cheia.svg" class="fullScreem-icon" @click="fullScreamToggle">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
    mounted(){
        let control = document.querySelector('.controls')
        let self = this
        let MouseVerify = function VerifyMouse() {
            let timeOut = setTimeout(function() {
                try {
                    control.classList.add('opacity0')
                    this.askQuestion = false
                            
                } catch (error) {
                         
                }   
            }.bind(self), 7000);
            return timeOut
        }

        const interval = setInterval(() => {
            MouseVerify()
        }, 7000);

        document.querySelector('.video-container').addEventListener('mousemove',function(){
            try {
                this.askQuestion = true
                control.classList.remove('opacity0')
                
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
            duration: this.$props.durationProps,
            IsDraggingBar: false,
            isDraggingVolume: false,
            askQuestion: true,
            temp: this.$route.params.temp,
            ep: this.$route.params.ep,
            list: false,
            close: false,
        }
    },
    props: {
        time: String,
        durationProps: String,
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
     computed: {
        mediaQuery(){
            return this.$mq
        },
        tempProps(){
            return parseInt(this.temp)
        },
        epProps(){
            return parseInt(this.ep)
        }
    },
    methods: {
        PlayPauseVideo($event){
            this.$emit('PlayPauseVideo', $event)
             
        },
        mouseSegura($event){
            this.$emit('mouseSegura', $event)
        },
        setVolume($event){
            console.log($event)
            if($event.offsetX <= 0) return this.$emit('setVolume', 0)
            if(width / 100 >= 1) return this.$emit('setVolume', 1)
            let width = $event.offsetX || $event.touches[0].offsetX
            let volumeBar = document.getElementById('volume-bar')
            volumeBar.style.width = `${width}%`
            let volume = width / 100
            this.$emit('setVolume', volume)
        },
        addMovimentListener(){
            let volumeContainer = document.querySelector('.volume')
            volumeContainer.addEventListener('mousemove', this.moveVolumeBar)
        },
        moveVolumeBar(element){
            let volumeBar = document.getElementById('volume-bar')
            let width = element.offsetX
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
        removeMovimentListener(){
            let volumeContainer = document.querySelector('.volume')
            volumeContainer.removeEventListener('mousemove', this.moveVolumeBar)
        },
        aprenderMatematica($event){
            this.$emit('aprenderMatematica', $event)
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
        keysEvents($event){
            this.$emit('keysEvents', $event)
        },
        fullScreamToggle($event){
            this.$emit('fullScreamToggle', $event)
        },
        emitMuteUnmute(){
            this.$emit('muteUnmute')
        },
        setFalse(){
            this.clicado = false
        },
        heigth0(){
            document.querySelector('.serie-ep-list-container').classList.add('heigth0')
            this.closeList()
        },
        heigth100(){
            document.querySelector('.serie-ep-list-container').classList.remove('heigth0')
        },
        showList(){
            this.list = true
            this.askQuestion = false
            this.close = true
            this.heigth100()
        },
        closeList() {
            this.close = false
            setTimeout(() => {
                this.list = false
                this.askQuestion = true
            }, 999);
        }

    }
}
</script>

<style scoped>
.opacity0 {
    opacity: 0 !important;
}
.controls-container {
    width: 100%;
    height: 100%;
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
        transition: 0.3s;
        pointer-events: none;
        cursor: pointer;
    }
    .progress-bar-drag {
        height: 100%;
        position: absolute;
        width: 1%;
        background-color: var(--cor5);
        z-index: 3;
        pointer-events: none;
        cursor: pointer;
    }
    .show-eps {
        position: absolute;
        top: 5%;
        right: 5%;
        transform: translate(-5%, -5%);
        color: white;
        width: 160px;
        height: 50px;
        font-size: 0.9em;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.342);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;
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
    .btn-fundo {
        height: 100%;
        display: flex;
        align-items: center;
    }
    .btn-primary img {
        margin: 0px 2px;
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
    .serie-ep-list-container {
        width: 100%;
        max-width: 500px;
        height: 100%;
        margin: auto;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        z-index: 5;
        display: flex;
        transition: 1s;
    }
    .close {
        font-size: 1.8em;
        color: white;
        position: absolute;
        top: 0.5%;
        right: 2%;
        cursor: pointer;
        z-index: 5;
    }
    .heigth0 {
        height: 0px;
    }

</style>