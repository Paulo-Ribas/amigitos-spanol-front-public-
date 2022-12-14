<template>
  <div class="container-serie-video">
    <video :src="episodeLink" controls></video>
    <ControlsPlayer/>
  </div>
</template>

<script>
export default {
    async asyncData(context){
        console.log(context)
        let episodeLink = await context.app.store.dispatch('series/getEp', {temp:context.route.params.temp,ep: context.route.params.ep})
        console.log(episodeLink)
        return {
            episodeLink: episodeLink.amazonFront
        }
    },
    data(){}
}
</script>

<style scoped>
    .container-serie-video {
        flex: 1;
        height: 100vh;
        position: relative;
    }
    video {
        width: 100%;
        height: 100%;
        position: absolute;
        outline: none;
    }
</style>