<template>
  <div class="pop-up-container">
    <span>{{text}}</span>
  </div>

</template>

<script>
export default {
    data(){
        return {
            text: this.$props.textProps
        }
    },
    props: {
        textProps: String,
    }

}
</script>

<style scoped>
    .pop-up-container {
        position: absolute;
        transform: translate(0px, 33px);
        background-color: var(--corMenu);
        width: 100px;
        height: fit-content;
        display: flex;
        z-index: 2;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .pop-up-container span {
        font-family: cursive;
        font-size: 0.5em;
        color: white;
    }
</style>