<template>
  <div class="serie-container" @click.stop="">
                <img src="/tardis.png" alt="tardis" id="tardis" v-if="showTardis">
                <div class="filter">
                    <div class="temp">
                        <label for="temp">temporada</label>
                        <div id="temp">
                            <div value="0" @click.stop="selected = true" class="selecionar">{{select}}</div>
                            <div class="option-container">
                                <div class="option" v-for="temps, index in temps" :key="index" :value="index + 1" v-show="selected" @click="seasonSelected(index + 1)">{{index + 1}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list-container">
                    <div class="ep-list-container">
                        <div class="ep-container" v-for="season, index in seasonEpisodeList" :key="index">
                            <NuxtLink v-if ="season.SpecialEpisode == 0" :class="{'ep': 'ep', 'pink': season.Episode == selectedEp && season.Season == selectedTemp}" :data-ep="index +1" :to="'/watch/Doctor-Who/' + season.Season +'/' + season.Episode + '?s=' + index">EP {{season.Episode}} - {{season.EpisodeName }} <span v-if="season.SpecialEpisode == 0">(Especial Natal)</span></NuxtLink>
                            <NuxtLink v-else :class="{'ep': 'ep', 'pink':  season.Episode == selectedEp && season.Season == selectedTemp}" :data-ep="index +1" :to="'/watch/Doctor-Who/' + season.Season +'/' + season.Episode">EP {{season.Episode}} - {{season.EpisodeName }} <span v-if="season.SpecialEpisode == 0">(Especial Natal)</span></NuxtLink>

                        </div>
                    </div>
                </div>
            </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    middleware: ['auth'],
    async fetch(){
         
        let eps = await this.$store.dispatch('series/getTemps')
         
        this.temps = eps.data
    },
    beforeMount(){
        this.setTemp()
    },
    mounted(){
        this.loaded = true
        if (this.selectedTemp) {
            this.select = this.selectedTemp
        }
    },
    data(){
        return {
            selectedTemp: this.$props.selectedTempProps,
            selectedEp: this.$props.selectedEpProps,
            seasonEpisodeList: [],
            loaded: false,
            showTardis: true,
            temps: [],
            selected: false,
            select: 'selecionar',
        }
    },
    props: {
        selectedEpProps: Number,
        selectedTempProps: Number
    },
    methods: {
        ...mapActions({
            selectSeasom: 'series/getTemp',
        }),
        async seasonSelected(season = 0){
             
            let selectedTemp = await this.selectSeasom({temp: season})
             
            season === 0? this.showTardis = true : this.showTardis = false
            this.selectedTemp = season
            this.seasonEpisodeList = selectedTemp.data
            this.select = season
            this.closeSelect()

        },
        async setTemp(){
             
            if (this.selectedTemp && this.selectedEp) {
                let selectedSeason = await this.selectSeasom(this.selectedTemp)
                this.seasonSelected(this.selectedTemp)
                 
            }
        },
        closeSelect(){
            this.selected = false
        }
    }
}
</script>

<style scoped>
    select {
        width: 100px;
    }
    .serie-container {
        font-family: cursive;
        height: 100%;
        width: 100%;
        max-width: 500px;
        background: var(--corMenu);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        position: relative;
        padding: 5px 0px;
    }
    .list-container {
        width: 100%;
        height: 100%;
        display: flex;
    }
    .ep-list-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .ep-container {
        width: 90%;
        text-align: center;
        border-bottom: 3px solid var(--cor1);
        padding: 5px 0px;
        margin-bottom: 5px;
    }
    .ep-container a{
        font-size: 1em;
        color: white;
        text-decoration: none;
        width: 100%;
        height: 100%;
        display: inline-block;
    }
    .ep-container a:hover {
        color: var(--cor5);
    }
    .pink{
        color: var(--cor5) !important;
    }
    .filter {
        font-family: cursive;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0px;
    }
    .temp {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .temp label {
        color: white;
        font-size: 1.1em;
    }
    #temp {
        text-align: center;
        border: 1px solid var(--cor2);
        color: var(--cor9);
        border-radius: 10px;
        outline: none;
        width: 140px;
        position: relative;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    .selecionar {
        cursor: pointer;
        width: 100%;
    }

    .option-container {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        position: absolute;
        background-color: var(--corMenu);
        border-radius: 10px;
        top: 26px;
    }
    .option {
        width: 100%;
        padding: 2.5px 0px;
        margin-top: 2.5px;
        
    }
    .option:hover {
        padding: 0px 0px;
        border: 2.5px solid var(--cor5);
        cursor: pointer;
    }
    #tardis{
        position: absolute;
        width: 60%;
        height: 60%;
        object-fit: contain;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

</style>