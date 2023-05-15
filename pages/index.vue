<template>
  <main>
    <div class="container-main" v-if="!loanding && show">
        <div class="container-text">
          <h1>ASSISTIR AO MESMO TEMPO</h1>
          <h2>Assista videos do youtube ao mesmo tempo com amigos em salas personalizadas ou assista videos próprios, fazendo upload dos videos desejados e criando uma sala personalizade para assistir ao em grupo com amigos, e caso também queira assistir Doctor Who, clique em assistir solo</h2>
        </div>
        <div class="login-sigin-container">
            <div class="login-container">
                  <NuxtLink to="/login">
                   Login
                  </NuxtLink>
             </div>
             <div class="sigin-container">
                <NuxtLink to="/sign-up">
                   Cadastre-se
                 </NuxtLink>
             </div>
          </div>
        </div>
  </main>
</template>

<script>
export default {
  name: '',
  layout: 'noMenu',
  fetch(){
    let token = this.$cookies.get('token')
    if (token) {
      this.$store.dispatch('user/validateUser', token).then(done => {
        this.$router.push({name:'users'})
      }).catch(err => {
        this.show = true
         
      })
    }
    else {
      this.show = true
    }
  },
  fetchOnServer: false,
  mounted(){
    this.loanding = false
  },
  head(){
        return {
            title: 'Assistir Ao Mesmo Tempo',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: 'description', name: 'description', content: 'um site feito em homenagem para um antigo grupo, aqui você pode assistir videos ao mesmo tempo com seus amigos, tanto pelo youtube ou você mesmo fazendo upload deles' },
                { name: 'format-detection', content: 'telephone=no'},
                {name:'robots', content: 'nofollow'},
                {name: 'author', content: 'Paulo Ribas'},
            ]
        }
    },
  data(){
    return {
      loanding: true,
      show: false
    }
  }
}
</script>
<style scoped>
  main{
    flex:1
  }
  .container-main{
    width: 100%;
    max-width: 800px;
    margin: auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: cursive;
    background-image: url('/tardis.png');
    background-size: contain;
  }
  .container-text{
    text-align: center;
  }
  .container-text h1 {
    color: var(--cor2);
    text-shadow: 0px 0px 5px var(--cor7);
  }
  .container-text h2 {
    max-width: 800px;
    font-size: 1.1em;
    margin: 20px 0px;
    color: black;
    text-shadow: 0px 0px 5px var(--cor3);
  }
  .login-sigin-container {
    width: 100%;
    max-width: 500px;
    display: flex;
    justify-content: space-evenly;
  }
  .login-container {
    width: 120px;
    height: 40px;
    background: var(--corMenu);
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--cor1);
  }
  .sigin-container {
    width: 120px;
    height: 40px;
    background: var(--corMenu);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 2px solid var(--cor1);
  }
  .login-sigin-container a {
    text-decoration: none;
    font-size: 1.1em;
    color: white;
    display: block;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>