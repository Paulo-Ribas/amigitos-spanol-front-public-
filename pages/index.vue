<template>
  <main>
    <div class="container-main">
        <div class="container-text">
          <h2>ASSISTIR AO MESMO TEMPO</h2>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam, ipsum ratione! Accusamus distinctio veritatis cumque, labore explicabo nam vitae nesciunt suscipit dolorem possimus, earum, harum cupiditate sunt inventore sit sed quidem exercitationem iure.</p>
        </div>
        <div class="login-sigin-container">
            <div class="login-container">
              <h3>Login</h3>
              <div class="link-container">
                <img src="/svg/gusta.svg" class="tardis-icon">
                  <NuxtLink to="/login">
                   Assistir Com Youtube
                  </NuxtLink>
              </div>
            </div>
            <div class="sigin-container">
              <h3>Cadastre-se</h3>
             <div class="link-container">
                <NuxtLink to="/login">
                   Ou Também Assista O Próprio Video
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
  layout: 'noMenu'
}
</script>
<style scoped>
  main{
    flex: 1;
  }
  .container-main {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
  }
  .container-text {
    height: 400px;
    font-family: cursive;
    padding: 0px 2%;
    width: 50%;
  }
  .container-text h2 {
    color: var(--cor1);
    font-size: 2em;
    text-align: center;
    text-shadow: 0px 0px 6px var(--cor7);
    margin-top: 20px;
    text-align: left;
  }
  .container-text p {
    margin-top: 10px;
    color: lightgray;
    font-size: 1.1em;
    text-shadow: 0px 0px 4px var(--cor2);
    font-weight: lighter;
  }
  .login-sigin-container {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 400px;
    font-family: cursive;
  }
  .text-container {
    color: var(--cor1);
    font-size: 1em;
    padding: 0px 15px;
  }
  .login-container, .sigin-container {
    width: 100%;
  }
  .login-container h3{
    text-align: center;
    font-size: 1.4em;
    font-family: cursive;
    margin: 4px;
    color: var(--cor5);
  }
  .sigin-container h3 {
    text-align: center;
    font-size: 1.4em;
    font-family: cursive;
    margin: 4px;
    color: var(--cor2);
  }
  .link-container {
    width: 100%;
    height: 80px;
    position: relative;
  }
  .tardis-icon {
    position: absolute;
    width: 75px;
    height: 75px;
    top: 50%;
    left: -9%;
    transform: translate(0%, -50%);
    z-index: 2;
    pointer-events: none;
    transition: 0.5s
  }
  .login-container .link-container a{
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: var(--cor7);
    border-radius: 6px;
    border-top-left-radius: 20px;
    border-top-right-radius: 50%;
    transform: translateX(-60px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--cor9);
    text-decoration: none;
    font-size: 1em;
    transition: 0.6s
  }
  .login-container .link-container a:hover{
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: var(--cor7);
    border-top-left-radius: 50%;
    border-top-right-radius: 20px;
    transform: translateX(0px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--cor9);
    text-decoration: none;
    font-size: 1em;
  }
  .login-container .link-container:hover > img {
    left: 90%;
  }
  .sigin-container .link-container a {
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: var(--cor7);
    border-radius: 40px;
    transform: translateX(0px);;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--cor1);
    text-decoration: none;
    font-size: 1em;
  }

</style>