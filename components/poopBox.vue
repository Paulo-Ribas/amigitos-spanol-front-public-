<template>
  <div class="container-box-poop" @click="close()">
      <div class="warn-container">
        <h2>{{msg}}</h2>
        <div class="btn-container">
            <button class="confirm" @click="yes($event)">{{confirm}}</button>
            <button class="refuse" @click="no($event)">{{refuse}}</button>
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
            refuse: this.$props.btnRefuseProps,
            dates: this.$props.datesProps        
            }
    },
    props: {
        msgProps: String,
        btnConfirmProps: String,
        btnRefuseProps: String,
        datesProps: Object,
    },
    methods: {
        yes(){
             
            this.$emit('confirm', this.dates)
        },
        no(){
            this.$emit('refuse', this.refuse)
        },
        close(){
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
.container-box-poop {
    width: 100%;
    height: 100%;
    z-index: 8;
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
  text-align: center;
  
}
.warn-container h2 {
    font-family: cursive;
    color: var(--cor2);
}
.btn-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
}
.confirm{
    padding: 10px 30px;
    background-color: var(--cor5);
    font-family: cursive;
    color: wheat;
    border-radius: 10px;
    cursor: pointer !important;
}
.refuse{
    padding: 10px 30px;
    background-color: var(--cor4);
    font-family: cursive;
    color: white;
    border-radius: 10px;
    cursor: pointer !important;
}
</style>