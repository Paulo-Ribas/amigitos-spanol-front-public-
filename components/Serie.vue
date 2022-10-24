<template>
    <div class="serie-container">
        <NuxtLink :to="Url" class="link">
            <img :src="img" :alt="alt">
            <div class="name">
                <h2>{{name}}</h2>
            </div>
            <div class="info hidden">
                <span>{{name}}</span>
                <span class="seasons">Temporadas: {{seasons}}</span>
                <span class="descrition">{{descrition}}</span>
            </div>
        </NuxtLink>
    </div>
</template>

<script>
export default {
    data(){
        return {
            Url: this.$props.propsUrl,
            img: this.$props.propsImg,
            alt: this.$props.propsAlt,
            name: this.$props.propsName,
            seasons: this.$props.propsSeasons,
            descrition: this.$props.propsDescrition
        }
    },
    props: {
        propsUrl: String,
        propsImg: String,
        propsAlt: String,
        propsName: String,
        propsSeasons: Number,
        propsDescrition: String,
    }
}
</script>

<style scoped>
    .serie-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 390px;
        min-width: 390px;
        min-height: 400px;
        background: var(--corMenu);
        margin: 0px 5px;
        
    }
    .link {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
    }
    img {
        width: 99%;
        height: 80%;
        object-fit: contain;
    }
    .name{
        font-size: 1.3em;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .info {
        position: absolute;
        height: 10%;
        display: none;
        width: 100%;
        background: var(--corMenu);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        color: white;
        transition: 1s;
    }
    span {
        display: none;
    }
    .info:hover {
        height: 100%;
        display: flex;
    }
    .info:hover span {
        display: inline;
        transition-delay: 1s;
    }
</style>