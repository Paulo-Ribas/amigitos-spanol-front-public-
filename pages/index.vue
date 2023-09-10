<template>
  <main>
    <div class="container-main" v-if="!loanding && show">
        <div class="imgAMG">
          <img src="/logoAmigitos.png" alt="logo amigitos">
        </div>
        <div class="container-text">
          <h1>ASSISTIR AO MESMO TEMPO</h1>
          <h2>Assista videos do youtube ao mesmo tempo com amigos em salas personalizadas ou assista videos próprios, fazendo upload dos videos desejados e criando uma sala personalizade para assistir ao em grupo com amigos, e caso também queira assistir Doctor Who, clique em assistir solo</h2>
        </div>
        <div class="login-sigin-container">
          <div class="containerFat">
            <div class="login-container">
                  <NuxtLink to="/login">
                   Login
                  </NuxtLink>
                </div>
            </div>
            <p>
                <span>
                  <fa icon="arrow-left"></fa>
                </span>
                <span>Seja um Amigito</span>
                <span>
                  <fa icon="arrow-right"></fa>
                </span>
            </p>
            <div class="containerFat">
              <div class="sigin-container">
                <NuxtLink to="/sign-up">
                     Cadastre-se
                  </NuxtLink>
              </div>
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
    flex:1;
    overflow: auto;
  }
  .container-main{
    padding: 10% 3%;
    width: 100%;
    max-width: 800px;
    margin: auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: cursive;
  }
  .container-text{
    text-align: center;
  }
  .container-text h1 {
    color: white;
    background: var(--ReverseBackground);
    margin: 10px 0px;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-stroke: .15625em transparent ;
  }
  .container-text h2 {
    max-width: 800px;
    font-size: 1.1em;
    margin-bottom: 20px;
    color: #FFFFFF;
  }
  .login-sigin-container {
    width: 100%;
    max-width: 500px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .login-sigin-container p{
    font-size: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    color: white;
    background: var(--background);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-stroke: .25em transparent ;
    flex: 1;
  }
  .login-sigin-container p svg{
    stroke-width: 2px;
    stroke: var(--background);
  }
  .login-sigin-container p > span{
    text-transform: uppercase;
    letter-spacing: -0.5px;
  }
  .containerFat{
    background-color: var(--cor5);
    width: 130px;
    height: 50px;
    border-radius: 10px;
    padding: 1px .7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
  .login-container, .sigin-container {
    margin: auto;
    width: calc(100% - .2100em);
    height: calc(100% - .2100em);
    background: var(--corMenu);
    border-radius: 10px; /* 10px .625em*/
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: .1875em solid var(--cor5); */ /* 3px */
    text-align: center;
  }
  .login-sigin-container a {
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.9em;
    color: white;
    display: block;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-container:hover, .sigin-container:hover {
    background-color: white;
    
  }
  .login-container:hover a, .sigin-container:hover a {
    color: transparent;
    background: var(--ReverseBackground);
    background-clip: text;
    -webkit-background-clip: text;
  }
  .containerFat:has(.login-container:hover), .containerFat:has(.sigin-container:hover){
    background: var(--ReverseBackground);
  }
  .login-container:active, .sigin-container:active {
    background-color: white;
    
  }
  .login-container:active a, .sigin-container:active a {
    color: transparent;
    background: var(--ReverseBackground);
    background-clip: text;
    -webkit-background-clip: text;
  }
  .containerFat:has(.login-container:active), .containerFat:has(.sigin-container:active){
    background: var(--ReverseBackground);
  }
  
</style>