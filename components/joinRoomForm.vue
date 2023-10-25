<template>
  <form class="roomForm" @submit="submitEmit($event)">
    <label for="password">{{labelPassValue}}</label>
    <input type="password" id="pass" :placeholder="inputPlaceholderValue" v-model="password">
    <input type="submit" :value="inputSubmitValue">
  </form>
</template>

<script>
export default {
    data(){
        return {
            labelPassValue: this.$props.labelPassProps,
            inputPlaceholderValue: this.$props.inputPlaceholderProps,
            inputSubmitValue: this.$props.inputSubmitProps,
            password:'',
        }
    },
    props:{
        labelPassProps: String,
        inputPlaceholderProps: String,
        inputSubmitProps: String,
    },
    methods:{
        submitEmit($event){
            $event.preventDefault()
            this.$emit('submitEmited', {password: this.password})
        }
    }
}
</script>

<style scoped>
    .roomForm {
        width: 99%;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    label {
        font-family: cursive;
        font-size: 1.2em;
        color: white;
    }
    input[type="submit"] {
        max-width: 180px;
        padding: 10px 5px;
        border-radius: 50px;
    }
    input {
        width: 100%;
        max-width: 410px;
        background-color: var(--corMenu);
        padding: 7.5px 10px;
        margin: 10px 0px;
        color: white !important;
        font-size: 1em;
        outline: none;
        border-radius: 50px;
        font-family: cursive;
    }


</style>