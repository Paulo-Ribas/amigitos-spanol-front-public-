<template>
   <section id="series">
      <div class="container-seasons">
         <div class="series-row">
            <Serie propsBackGround='/doctor-who-vortex.gif'
            propsUrl='watch/Doctor-Who' 
            propsImg='/DW.jpg' 
            propsAlt='imagem do seriado doctor who'
            propsName='Doctor Who'
            :propsSeasons='seasons'
            propsDescrition='seriado de ficção cientifica'
            >
            </Serie>
         </div>
      </div>
   </section>
</template>

<script>
   import {mapActions} from 'vuex'
export default {
   asyncData(context) {
      let seasonsLength = context.store.dispatch('series/getTemp')
      return {
         seasons: seasonsLength.data.length
      }
   },
   head(){
        return {
            title: 'Series',
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
      }
    },
    methods: {
      ...mapActions({
            selectSeasom: 'series/getTemps'
        }),
    }
}
</script>

<style scoped>
   #series {
      height: 100vh;
      flex: 1;
      overflow: auto;
   }
   .container-seasons {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
   }
   .series-row {
      width: 98%;
      height: 95%;
      max-width: 1350px;
      display: flex;
      overflow-X: auto;
      padding: 10px 0px;
      overflow-y: hidden;
   }
   @media screen and (max-width: 400px) {
      .series-row {
         flex-direction: column;
         align-items: center;
         overflow-x: hidden;
      }
      
   }
</style>