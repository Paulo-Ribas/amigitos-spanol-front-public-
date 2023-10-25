<template>
    <div class="box-container-request">
        <div class="video-dates">
            <fa class="icon" icon="xmark" @click="hiddenRequest()"></fa>
            <div class="videoImg">
                <img :src="videoImg">
            </div>
            <h2 class="name">
                {{ videoName }}
            </h2>
        </div>
        <div class="user-request-info">
            <p>pedido feito por: <span class="name">{{ userRequestName }}</span></p>
        </div>
        <div class="btn-container">
            <button class="accept" @click="acceptRequest()">Aceitar</button> <button class="refuse" @click="rejectRequest()">Rejeitar</button>
        </div>
    </div>
</template>

<script>

export default {
    mounted() {
        this.userRequestName = this.requestInfo.userName
         
        this.id = this.requestInfo.id
        this.videoImg = this.requestInfo.thumb
        this.videoName = this.requestInfo.name
    },
    data() {
        return {
            requestInfo: this.$props.requestInfoProps,
            videoName: undefined,
            videoImg: undefined,
            userRequestName: '',
            id: undefined,
        }
    },
    props: {
        requestInfoProps: Object,
    },
    watch: {
        requestInfoProps(value, payload) {
            this.requestInfo = value
             

        },
    },
    methods: {
        acceptRequest() {
            let videoInfo = {
                requestInfo: this.requestInfo,
                id: this.id
            }
             
            this.$emit('accepted', videoInfo)
        },
        rejectRequest() {
            let videoInfo = {
                requestInfo: this.requestInfo,
                id: this.id
            }
            this.$emit('rejected', videoInfo)
        },
        hiddenRequest(){
            this.$emit('hiddenRequest')
        }

    }
}
</script>

<style scoped>
.icon {
    font-size: 2rem;
    color: white;
    cursor: pointer;
    transition: 0.2s;
}
.icon:hover {
    color: var(--cor6) !important;
}
.box-container-request {
    width: -webkit-fill-available;
    height: 100%;
    position: absolute;
    z-index: 7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--corMenu);
}
.video-dates {
    width: 90%;
    height: 100%;
    max-height: 415px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.name {
    color: white;
    font-family: cursive;
    margin: 5px 0px;
    text-shadow: 0px 0px 5px var(--cor7);
}
.videoImg{
    width: 90%;
    height: 90%;
    max-width: 400px;
    max-height: 300px;
    position: relative;
}
.videoImg img {
    width: 100%;
    height: 100%;
    position: absolute;
    object-fit: cover;
    object-position: center;
}

.user-request-info p {
    color: var(--cor9);
    text-decoration: underline;
    text-shadow: 0px 0px 1px var(--cor3),0px 0px 1px var(--cor3);
    font-family: cursive;
    margin-left: 10px;
}
.user-request-info{    
    width: 100%;
    max-width: 480px;
}
.btn-container {
    width: 100%;
    display: flex;
    justify-content: center;
    max-width: 800px;
    margin: 10px 0px;
}
.btn-container .accept {
    background-color: var(--corMenu);
    padding: 10px 15px;
    border-radius: 5px;
    /* border: 1px solid white; */
    color: white;
    font-family: cursive;
    margin: 0px 10px;
}
.btn-container .refuse {
    
    background-color: var(--cor6);
    padding: 10px 15px;
    border-radius: 5px;
    /* border: 1px solid white; */
    color: white;
    font-family: cursive;
    margin: 0px 10px;

}
</style>