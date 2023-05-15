<template>
    <div class="app">
      <HeaderAside/>
      <Nuxt @ask="showAlgo = true"/>
    </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      showAlgo: false
    }
  },
}
</script>

<style scoped>
  .app {
    display: flex;
    background: var(--background);
  }
</style>
