<template>
        <section id="serie">
            <div class="serie-container">
                <div class="filter">
                    <div class="ep">
                        <label for="ep">episódio: </label>
                        <select id="ep">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="es">especial natal</option>
                        </select>
                    </div>
                    <div class="temp">
                        <label for="temp">temporada: </label>
                        <select id="temp">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                    </div>
                </div>
                <div class="grid-container">
                    <div class="serie-list-temps">
                        <div class="temps-conteiner" v-for="temp, index in temps" :key="index">
                            <h2 @click="selecetSeason(index)">temporada {{index + 1}}</h2>
                        </div>
                    </div>
                    <div class="ep-list-container">
                        <div class="ep-container" v-for="season, index in season" :key="index">
                            <NuxtLink class="ep" :to="'Doctor-Who/' + season.temp +'/' + season.ep">EP {{season.ep}}</NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>

</template>

<script>
export default {
    middleware: ['auth'],
    async fetch(){
        let eps = await this.$store.dispatch('series/getTemps')
        console.log(eps)
        this.temps = eps.Dw
        
    },
    data(){
        return {
            season: this.temps,
            temps: []
        }
    },
    computed: {
        tempsComputed(){
            return this.temps
        }
    },
    methods: {
        selecetSeason(season){
            this.season = this.temps[season]
            console.log(this.temps)

        }
    }
}
</script>

<style>

</style>