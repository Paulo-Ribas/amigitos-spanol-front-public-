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
    name:"controls-Live",
    data(){
        return {

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
        fullScream($event){
            this.$emit('fullScream', $event)
        },

    }
}
</script>

<style>
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