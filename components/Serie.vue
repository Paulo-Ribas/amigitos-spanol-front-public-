<template>
    <div class="serie-container" @mouseover="setStartCssTimingAnimation()" @mouseout="setEndCssTimingAnimation()">
        <div id="background"></div>
        <NuxtLink :to="Url" class="link">
            <img :src="img" :alt="alt">
            <div class="name">
                <h2>{{name}}</h2>
            </div>
            <div id="info">
                <span>{{name}}</span>
                <span class="seasons">Temporadas: {{seasons}}</span>
                <span class="descrition">{{descrition}}</span>
            </div>
        </NuxtLink>
    </div>
</template>

<script>
export default {
    mounted(){
        let serieeBackground = document.getElementById('background')
        serieeBackground.style.backgroundImage = this.backGroundUrl 
    },
    data(){
        return {
            Url: this.$props.propsUrl,
            img: this.$props.propsImg,
            alt: this.$props.propsAlt,
            name: this.$props.propsName,
            seasons: this.$props.propsSeasons,
            descrition: this.$props.propsDescrition,
            backGround: this.$props.propsBackGround
        }
    },
    props: {
        propsUrl: String,
        propsImg: String,
        propsAlt: String,
        propsName: String,
        propsSeasons: Number,
        propsDescrition: String,
        propsBackGround: String,
    },
    computed: {
        backGroundUrl(){
            return `url('${this.backGround}')`
        }
    },
    methods: {
        setStartCssTimingAnimation(){
            let info = document.getElementById('info')
            info.style.transitionDelay = "1.5s"
            let spans = document.querySelectorAll('#info span')
            spans.forEach(span => {
                span.classList.add('transition1')
                span.classList.remove('transitionDelay05')
            })
        },
        setEndCssTimingAnimation(){
            let info = document.getElementById('info')
            info.style.transitionDelay = '0s'
            info.style.transitionDuration = '0.5s'
            let spans = document.querySelectorAll('#info span')
            spans.forEach(span => {
                span.classList.remove('transition1')
                span.classList.add('transitionDelay05')
            })
        }
    }
}
</script>

<style scoped>
    .serie-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 380px;
        margin: 0px 5px;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
        background-color: var(--corMenu);
    }
    .serie-container a {
        text-decoration: none;
    }
    #background {
        width: 0%;
        height: 0%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        position: absolute;
    }
    .serie-container:hover #background {
        position: absolute;
        height: 100%;
        width: 100%;
    }
    .serie-container:hover a{
        padding: 250px;
    }
    .serie-container:hover .name h2 {
        text-align: center;
        color: white;
        text-decoration: underline;
        text-decoration-color: var(--cor4);
        transform: translateY(0px);
        animation: nameAnimation 2s;
        animation-fill-mode: forwards;
    }
    .serie-container:hover #info {
         height: 100%;
         display: flex;
         
    }
    .serie-container:hover #info span {
        opacity: 1;
    }
    .link {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        transition: 1s;
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
    #info {
        position: absolute;
        height: 0%;
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
        opacity: 0;
        transition: 0.5s;
    }
    .transition1 {
        transition: 1s;
        transition-delay: 1.5s;
    }
    .transitionDelay05 {
        transition: 0.5s;
    }
    .name h2 {
        color: var(--cor1);
        transform: translateY(10px);
    }
    @keyframes nameAnimation {
        from {
            scale: 0;
        }
        to {
            scale: 1.2;
        }
        
    }
</style>