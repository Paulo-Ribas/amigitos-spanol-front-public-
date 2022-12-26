<template>
  <div class="container-box-poop" v-if="showAlgo" @ask="showAlgo = true" @click="close">
      <div class="warn-container">
        <h2>{{msg}}</h2>
        <div class="btn-container">
            <button class="confirm" @click="yes">{{confirm}}</button>
            <button class="refuse" @click="close">{{refuse}}</button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            msg: this.$props.msgProps,
            confirm: this.$props.btnConfirmProps,
            refuse: this.$props.btnRefuseProps
        }
    },
    props: {
        msgProps: String,
        btnConfirmProps: String,
        btnRefuseProps: String,
    },
    methods: {
        confirm(){

        },
        refuse(){

        }
    }
}
</script>

<style scoped>
.container-box-poop {
    width: 106%;
    height: 100vh;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.24);
    position: absolute;
}
.warn-container{
  width: 100%;
  max-width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: var(--cor7);
  border-radius: 25px;
  
}
.warn-container h2 {
    font-family: cursive;
    color: var(--cor2);
}
.btn-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    pointer-events: none;
}
.confirm{
    padding: 10px 30px;
    background-color: var(--cor5);
    font-family: cursive;
    color: wheat;
    border-radius: 10px;
}
.refuse{
    padding: 10px 30px;
    background-color: var(--cor4);
    font-family: cursive;
    color: wheat;
    border-radius: 10px;
}
</style>