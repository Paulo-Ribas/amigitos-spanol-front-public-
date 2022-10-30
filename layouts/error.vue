<template>
  <dir class="erro">
    <div class="erro-container">
      <TransitionGroup name="h1h2">
        <h2 key="message" v-if="created">{{Message}}</h2>
        <h2 key="status" v-if="created">Status:{{ERROStatus}}</h2>
      </TransitionGroup>
      <Transition name="h3">
        <h3 v-if="created">se vocês clicaram em alguma coisa tipo, assistir Doctor Who ou os videos estudando e caiu aqui, é porque a pagina não existe por culpa do gusta preguiçoso que não acaba a API dele</h3>
      </Transition>
    </div>
  </dir>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'testeLayout',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  mounted(){
    this.created = true
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
      ERROStatus: this.$props.error.statusCode,
      Message: this.$props.error.message,
      created: false,
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
.erro {
  flex: 1;
  height: 100vh;
  background: url('/erroPaginaLoL.gif');
  background-position: center;
  background-size: cover;
}
.erro-container {
  width: 100%;
  height: 100vh;
  max-width: 650px;
  padding: 40px;
  text-shadow: 0px 0px 8px var(--cor7),0px 0px 8px var(--cor7);
}
h1 {
  font-size: 2.1em;
  color: white;

}
h2 {
  font-size: 2em;
  color: white;
}
h3 {
  color: white;
  margin: 10px 0px;
  transform: translateX(0px);
}
.h1h2-enter-active {
  transition-delay: 8s;
  transition: 2s;
}
.h1h2-enter {
  opacity: 0;
}
.h1h2-enter-to {
  opacity: 1;
}
.h3-enter-active {
  transition-delay:9s;
  transition: 2s;
}
.h3-enter {
  transform: translateX(-100px);
}
.h3-enter-to {
  transform: translateX(0px);
}
</style>
