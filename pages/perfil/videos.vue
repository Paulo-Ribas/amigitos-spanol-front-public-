<template>
  <div id="videos" v-if="!loanding">
    <h2>Videos</h2>
      <TabbleVideosList :btnProps="'deletar'" :videosProps="user.videos" @selected="areYouSure($event)"></TabbleVideosList>
    <div class="progress-bar" v-if="uploading">
      <span class="completed" v-if="completed">completo</span>
      <span class="status" v-if="uploading">enviando arquivo</span>
      <span class="processing" v-if="prossesing">processando</span>
      <span class="erro_video" v-if="videoErr">{{videoErr}}</span>
      <span class="porcent">0%</span>
      <div class="progress"></div>
    </div>
    <button @click="clickInput" class="add-videos">Adicionar Video</button>
    <input type="file" hidden id="file" @change="uploadVideo"/>
  </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
  name: "qeqw",
  async asyncData(context){
    let videos = await context.app.store.dispatch('user/getSetVideos', context.$cookies.get('token'))
    context.app.store.commit('user/SET_VIDEOS', videos)
    return {
      videos: videos
    }
  },
  async fetch(){
    let user = await this.$store.dispatch('user/validateUser', this.$cookies.get('token'))
     this.$store.commit('user/SET_USER_INFO',user)
     
  },
  beforeMount() {
    console.log(this.$store.state.user.token)
  },
  mounted() {
    this.loanding = false
  },
  fetchOnServer: false,
  data() {
    return {
      token: undefined,
      loanding: true,
      uploading: false,
      prossesing: false,
      completed: false,
      videoErr: undefined
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    ...mapActions({postVideo: 'user/postVideo', getSetVideos: 'user/getSetVideos'}),
    ...mapMutations({SET_VIDEOS: 'user/SET_VIDEOS'}),
    clickInput() {
      let input = document.getElementById("file");
      input.click();
    },
    uploadVideo() {
      const Form = new FormData();
      let file = document.getElementById("file");
      Form.append("video", file.files[0]);
      this.completed = false
      this.uploading = true
      let axiosInfos = {
        file: Form,
        getprogressAndSetHeaders:{
          onUploadProgress(event){
              let progress = Math.round((event.loaded * 100) / event.total)
              let progressBar = document.querySelector('.progress')
              let progressPorcent = document.querySelector('.porcent')
              let status = document.querySelector('.status')
              progressBar.style.width = `${progress}%`
              progressPorcent.innerHTML = `${progress}%` //inner para matar as saudades
              if (progress === 100) {
                progressPorcent.innerHTML = ''
                status.innerHTML = 'processando'
              }
          },
          headers: { authorization: this.$cookies.get('token')}
        }
      }
      this.postVideo(axiosInfos).then(res => {
        console.log('chegou no postar ao menos')
        this.getSetVideos(this.$cookies.get('token')).then(videos => {
          this.uploading = false
          this.completed = true
        }).catch(erro => {
          console.log('talvez n esteja sendo atualizado por causa desse erro', erro)
        })
      }).catch(err =>{
        console.log(err)
        this.uploading = false,
        console.log(err.response.data)
        this.videoErr = err.response.data.err
        console.log(this.videoErr)
      })


    },
    areYouSure($event){
      this.$emit('question', $event)
    },
    deleteVideo(){
      console.log('deletei kkkk')
    }
  },
};
</script>

<style scoped>
*>>> td {
  color: var(--cor2);
  font-family: cursive;
  padding: 0px 2px;
}
*>>> tr {
  margin: 2px 0px;
  background-color: var(--cor4);
}
*>>> td img {
  width: 50px;
  height: 50px;
}
*>>> h2 {
  color: var(--cor3);
  font-family: cursive;
  background-color: var(--cor7);
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
*>>> table {
  width: 100%;
}
*>>> .add-videos {
  width: 100%;
  padding: 8px 0px;
  font-family: cursive;
  color: white;
  text-align: center;
  background-color: var(--cor4);
  display: block;
  text-decoration: none;
}
*>>> .progress-bar {
    width: 100%;
    max-width: 300px;
    height: 5px;
    position: absolute;
    bottom: -3%;
    left: 50%;
    transform: translate(-50%, -5%);
    background-color: var(--cor7);
}
*>>> .progress {
  width: 0%;
  height: 100%;
  z-index: 1;
  position: absolute;
  background-color: var(--cor8);
}
*>>> span{
    position: absolute;
    color: white;
    font-family: cursive;
    top: 6%;
    left: 50%;
    transform: translateX(-50%);

}
*>>> span.porcent {
  transform: translateY(22px);
}
*>>> .delete {
  cursor: pointer;

}
*>>> .delete:hover {
  cursor: pointer;
  color: var(--cor6);
  
}
</style>