<template>
    <div class="mobile-controls-container" @click="toggleControll" @touchend="stopAllDraggings()" @mouseup.stop="stopAllDraggings" @mousemove.stop="draggingVolume($event), draggingBar($event)" @touchmove.stop="draggingVolume($event), draggingBar($event)" >
        <div class="controls-container" v-show="displayBlock">
            <div class="skip-container" @click.stop="removeDisplayBlock">
                <img src="/svg/adiantar_o_video_.svg" @click.stop="skip()" class="skip-icon">
            </div>
            <img src="/svg/botao_play_.svg" class="play-pause-icon" @click="PlayPauseVideo">
            <div class="return-container" @click.stop="removeDisplayBlock">
                <img src="/svg/regressar_o_video_.svg" class="return-icon" @click.stop="Return()">
            </div>
        </div>
        <div class="controls" @keydown="keysEvents">
                    <div class="progress" @click="setFalse(), aprenderMatematica($event)"  @mousedown="setDragging($event,'bar')" @touchstart="setDragging($event,'bar')" @touchmove="draggingBar($event)" draggable="false">
                    <div class="progress-bar" draggable="false"></div>
                    <div class="progress-bar-drag" v-show="IsDraggingBar" draggable="false"></div>
            </div>
            <div class="container-btns">
                <div class="btn-primary">
                    <div class="timer">{{ currentTime }} / {{ duration }}</div>
                    <div class="volume-container">
                <img src="/svg/com_som.svg" @click="emitMuteUnmute()" class="volume-icon">
                <div class="volume" @mousedown="setDragging($event, 'volume')" @click="setVolume($event)" @mousemove="draggingVolume($event)" @touchstart="setDragging($event, 'volume')" @touchmove="draggingVolume($event)" >
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
    mounted() {
        let controls = document.querySelector('.controls')
        let self = this
        let MouseVerify = function VerifyMouse() {
            let timeOut = setTimeout(function () {
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
        document.querySelector('.video-container').addEventListener('click', function () {
            try {
                controls.classList.remove('opacity0')
                this.toggleControll()
            } catch (error) {
                throw error
            }
            clearInterval(MouseVerify)
        }.bind(self))
        window.addEventListener('beforeunload', () => {
            return clearInterval(interval)
        })
    },
    data() {
        return {
            currentTime: this.$props.time,
            duration: this.$props.durationProps,
            displayBlock: false,
            showControls: 0,
            IsDraggingBar: false,
            isDraggingVolume: false,
            lastTouch: 0,
        }
    },
    props: {
        time: String,
        durationProps: String,
    },
    watch: {
        time(value, payload) {
            if (value === null) return
            this.currentTime = value
        },
        durationProps(value, payload) {
            this.duration = value
        }
    },
    methods: {
        PlayPauseVideo($event) {
            this.$emit('PlayPauseVideo', $event)

        },
        mouseSegura($event) {
            this.$emit('mouseSegura', $event)
        },
        setVolume($event){
            let volume2 = document.querySelector('.volume')
            let width
            if($event.touches) width = ($event.touches[0].clientX - volume2.offsetLeft)
            if(!$event.touches) width = $event.offsetX
            console.log(width)
            if(width / 100 <= 0) return this.$emit('setVolume', 0)
            if(width / 100 >= 1) return this.$emit('setVolume', 1)
            let volumeBar = document.getElementById('volume-bar')
            volumeBar.style.width = `${width}%`
            let volume = width / 100
            this.$emit('setVolume', volume)
        },
        addMovimentListener() {
            let volumeContainer = document.querySelector('.volume')
            volumeContainer.addEventListener('mousemove', this.moveVolumeBar)
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
        moveVolumeBar(element) {
            let volumeBar = document.getElementById('volume-bar')
            let width = element.offsetX || element.touches[0].offsetX
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
        draggingBar($event){
            if(this.IsDraggingBar){
                this.stopUserSelect()
                this.lastTouch = $event
                this.$emit('setProgressBarWidth', $event)
            }
        },
        draggingVolume($event){
            if(!this.isDraggingVolume) return
            if($event.touches){
                console.log('is dragging', $event)
            }
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
            if(this.IsDraggingBar) {
                this.aprenderMatematica(this.lastTouch)
            }
            if(!this.isDraggingVolume && !this.IsDraggingBar) return
            this.isDraggingVolume = false
            this.IsDraggingBar = false
            let timer = document.querySelector('.timer')
            timer.style.userSelect = 'auto'


        },
        skip(){
            this.keysEvents('ArrowRight')
        },
        Return(){
            this.keysEvents('ArrowLeft')
        },
        keysEvents($event) {
            let event = { code: $event, key:{code: $event} }

            this.$emit('keysEvents', event)
        },
        fullScreamToggle($event) {
            this.$emit('fullScreamToggle', $event)
        },
        emitMuteUnmute() {
            this.$emit('muteUnmute')
        },
        emitTheaterMode() {
            this.$emit('theaterMode')
            this.fullScreamToggle()
        },
        toggleControll() {
            this.displayBlock = true
        },
        removeDisplayBlock() {
            this.displayBlock = false
        },
        teste($event) {
            if ($event.type === 'mousedown') {
                this.clicado = true
            }
            else {
                this.clicado = false
            }
        },
        ultimoTeste($event) {
            if (this.clicado === true) {
                this.aprenderMatematica($event)
            }

        },
        setFalse() {
            this.clicado = false
        }

    }
}
</script>

<style scoped>
.opacity0 {
    opacity: 0 !important;
}

.mobile-controls-container {
    width: 100%;
    height: 100%;
    z-index: 2;
}

.controls-container {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    background-color: var(--corMenu);
}

.skip-container {
    width: 50%;
    height: 100%;
    position: absolute;
    z-index: 1;
    right: 0;
}

.return-container {
    width: 50%;
    height: 100%;
    position: absolute;
    z-index: 1;
    left: 0;
}

.controls {
    width: 100%;
    height: 50px;
    z-index: 5;
    color: white;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.342);
}

.progress {
    width: 100%;
    background-color: var(--cor2);
    height: 9px;
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
    height: calc(100% - 14px);
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
    height: 22px;
    width: 22px;
    cursor: pointer;
    position: relative;
    z-index: 3;
}


.play-pause-icon,
.skip-icon,
.return-icon {
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

.volume-container {
        display: flex;
        align-items: center;
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
        margin-right: 5px;
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
</style>