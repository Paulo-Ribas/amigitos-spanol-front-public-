<template>
  <div class="list-container">
    <div class="warning" v-for="(warn, index) in requestArray" :key="index" @click="emitVideoSelected(warn)" @mouseover="showInfo = true" @mouseleave="showInfo = false">
        <fa icon="exclamation">
            <PopUpInfo textProps="Video Request" v-if="showInfo"/>
        </fa>
    </div>
  </div>
</template>

<script>
export default {
    mounted(){
         
    },
    data(){
        return {
            requestArray: this.$props.requestArrayProps,
            showInfo: false,
        }
    },
    props: {
        requestArrayProps: Array,
    },
    watch:{
        requestArrayProps(value, payload){
            this.requestArray = value
             
        },
    },
    methods:{
        emitVideoSelected($event){
             
            this.$emit('requestSelected', $event)
        },

    }
}
</script>

<style scoped>
    .list-container {
        width: 100%;
        max-width: 200px;
        position: absolute;
        height: 100%;
        z-index: 4;
        right: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        pointer-events: none;
    }
    .warning {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid var(--cor7);
        background-color: var(--cor6);
        color: white;
        margin: 3px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        pointer-events: all;
    }
    .fa-exclamation {
        font-size: 2.1em;
        font-weight: bolder;
        font-family: cursive;
    }
    @media screen and (max-width: 600px) {
        .list-container {
            display: flex;
            flex-direction: row !important;
            height: 56px;
            max-width: 99% !important;
            overflow-x: auto;
            align-items: center;
                        
        }
        .warning {
            margin: 0px 3px !important;
        }
    }

     
</style>