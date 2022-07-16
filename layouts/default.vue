<template>
    <div class="app">
      <HeaderAside/>
      <Nuxt @ask="showAlgo = true"/>
    </div>
</template>

<script>
import HeaderAside from '../components/HeaderAside.vue' 
export default {
  name: 'DefaultLayout',
  data () {
    return {
      showAlgo: false
    }
  },
  components:{
    HeaderAside
  }
}
</script>

<style scoped>
  .app {
    display: flex;
    overflow: none;
    background: var(--background);
  }
</style>
