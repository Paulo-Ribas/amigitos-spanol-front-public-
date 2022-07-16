<template>
    <div class="container-app">
        <div class="youtube-VideoPlayer">
            <iframe width="853" height="480" src="https://www.youtube.com/embed/gqK_69OJczc" controls="0" title="Doctor Who: The Majestic Tale (Of a Madman in a Box) - The Day of the Doctor Update" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
            <ChatVideoVue/>
    </div>
</template>

<script>
import ChatVideoVue from '../../../components/chatVideo.vue'

export default {
    components: {
        ChatVideoVue
    }
}
</script>

<style scoped>
    .container-app {
        flex: 1;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
    .youtube-VideoPlayer {
        flex: 2;
        max-width: 853px;
        min-width: 745px;
        background-color: var(--corMenu);
        height: 75vh;
        max-height: 480px;
        position: relative;
    }
    iframe {
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: 853px;
        max-height: 480px;
    }

</style>