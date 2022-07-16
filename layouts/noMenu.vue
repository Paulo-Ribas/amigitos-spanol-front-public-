<template>
    <div class="app">
        <Nuxt></Nuxt>
    </div>
</template>

<script>
export default {
    name: 'noMenu'

}
</script>

<style scoped>
  .app {
    display: flex;
    overflow: none;
    background: var(--background);
    height: 100vh;
  }
</style>
