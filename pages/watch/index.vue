<template>
   <section id="series">
      <div class="container-seasons">
         <div class="series-row">
            <Serie 
            propsUrl='watch/Doctor-Who' 
            propsImg='/DW.jpg' 
            propsAlt='imagem do seriado doctor whi'
            propsName='Doctor Who'
            :propsSeasons='13'
            propsDescrition='seriado de ficção cientifica'
            >
            </Serie>
         </div>
      </div>
   </section>
</template>

<script>
export default {

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
      overflow-X: scroll;
      padding: 10px 0px;

   }

</style>