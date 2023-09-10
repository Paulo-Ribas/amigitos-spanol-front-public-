<template>
        <section id="serie">
            <Erro erroProps="api de episódio ainda não está no ar"></Erro>
            <TardisLoadBig v-if="!loaded"></TardisLoadBig>
            <SerieSeasonList v-if="loaded" :selectedTempProps="0"></SerieSeasonList>
            <div class="background-img">
                <img src="/background.jpg">
            </div>
        </section>

</template>

<script>
import {mapActions} from 'vuex'
export default {
    middleware: ['auth'],
    mounted(){
        this.loaded = true
    },
    head(){
        return {
            title: 'Doctor Who',
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
            selectedTemp: 1,
            seasonList: [],
            loaded: false,
            showTardis: true,
        }
    },
    methods: {
        ...mapActions({
            selectSeasom: 'series/getTemp'
        }),
        async seasonSelected(season){
             
            let select = document.getElementById('temp').selectedIndex
            const temp = select
            let selectedTemp = await this.selectSeasom({temp})
             
             
            select === 0? this.showTardis = true : this.showTardis = false
            this.selectedTemp = temp
            this.seasonList = selectedTemp.data
            

        }
    }
}
</script>

<style scoped>
    #serie {
        flex: 1;
        height: 100vh;
        font-family: cursive;
        display: flex;
        position: relative;
    }
    .background-img {
        display: flex;
        flex: 1;
        position: relative;
    }
    .background-img img{
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        left: 0;
    }

</style>