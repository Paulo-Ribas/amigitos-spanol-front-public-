<template>
  <div id="videos" v-if="!loanding">
    <h2>Videos
    <span class="arrow" v-if="mobile">
      <NuxtLink to="/perfil">
        <fa icon="arrow-left"></fa>
      </NuxtLink>
    </span>
    </h2>
      <TabbleVideosList :btnProps="'deletar'" :videosProps="user.videos" :selectAllProps="false" @selected="areYouSure($event)"></TabbleVideosList>
    <div class="progress-bar" v-if="!completed">
      <span class="completed" v-if="completed">completo</span>
      <span class="status" v-if="prossesing && videoErr === ''">processando...</span>
      <span class="status" v-if="converting && videoErr === ''">convertendo...</span>
      <span class="status" v-if="uploading && !prossesing && !converting && !salving && videoErr === ''">enviando arquivo</span>
      <span class="status" v-if="salving && videoErr === ''">salvando...</span>
      <span class="erro_video" v-if="videoErr">{{videoErr}}</span>
      <span class="porcent" v-if="uploading && !prossesing && !salving"></span>
      <span class="videosUploading" v-if="countVideo > 0">{{countVideo}}</span>
      <div class="progress"></div>
      <TardisVerySmall v-if="showTardis" class="tardis-processing"></TardisVerySmall>
    </div>
    <button @click="clickInput" class="add-videos">Adicionar Video</button>
    <input type="file" accept="video/*" hidden id="file" @change="uploadVideo"/>
  </div>
</template>

<script>
import axios from 'axios'
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
    this.$emit('verify')
  },
  mounted() {
    this.loanding = false
    if (this.$route.fullPath === '/perfil/videos' && this.$mq === 'sm') {
      this.mobile = true
    }
  },
  beforeDestroy(){
    this.$emit('toggleMobile')
  },
  fetchOnServer: false,
  head(){
        return {
            title: 'videos',
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
  data() {
    return {
      token: undefined,
      loanding: true,
      uploading: false,
      prossesing: false,
      completed: true,
      videoErr: '',
      countVideo: 0,
      mobile: false,
      socket: undefined,
      salving: false,
      converting: false,
      showTardis: false,
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    ...mapActions({
      postVideo: 'user/postVideo', getSetVideos: 'user/getSetVideos', processVideo:'user/convertVideo',
      saveThumbnail:'user/saveThumbnail', createThumbnail:'user/createThumbnail'
    }),
    ...mapMutations({SET_VIDEOS: 'user/SET_VIDEOS'}),
    clickInput() {
      let input = document.getElementById("file");
      input.click();
    },
    setPropertyForVideoUpload(){
      this.completed = false
      this.uploading = true
      this.prossesing = false
      this.videoErr = ''
      this.countVideo += 1
    },
    readAsDataURLForUpload(blob){
       
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        let base64String = ''
        reader.onload = function (event) {
          base64String = event.currentTarget.result.split(',')[1]
        }
        reader.readAsDataURL(blob)
        reader.onloadend = function (end) {
          resolve(base64String)
          
        }
        reader.onerror = function (err) {
          reject()
        }
      })
    },
    async uploadVideo(){
      //let ConvertProgress = new EventSource('https://www.amigitos-espanol-api.com.br/convertVideo')
     /*  ConvertProgress.onmessage = function (data){
         
      } */
      
      const Form = new FormData();
      let file = document.getElementById("file");
      if(file.files.length < 1) return 
      let teste = file.files[0]
      Form.append("video", file.files[0]);
       

      this.setPropertyForVideoUpload()
      let headers = this.getAxiosHeaders()
      let axiosInfos = this.getAxiosConfigForUploadVideo(Form)
      let onUploadProgress = axiosInfos.getprogressAndSetHeaders.onUploadProgress.bind(this)
      try {
         
        this.prossesing = true
        this.showTardis = true
        let thumbnail = await this.createThumbnail({axiosInfos})
        this.prossesing = false
        this.showTardis = false
        let thumbnailName = Form.get('video').name
        let thumbnailForm = new FormData()

        thumbnailForm.append('thumbnail', thumbnail, thumbnailName)
         
        /* let base64String = await this.readAsDataURLForUpload(thumbnail) */
         
        axiosInfos.getprogressAndSetHeaders.headers.thumb = await this.saveThumbnail({thumbnail: thumbnailForm, headers})
         this.showTardis = false
        if(Form.get('video').type !== 'video/mp4') {
          this.converting = true
          this.showTardis = true
          let done = await this.processVideo({ axiosInfos })
          this.converting = false
          this.showTardis = false
            let name = Form.get('video').name
            let file = new File([done], name, { type: 'video/mp4' })
            Form.delete('video')
            Form.append('video', file)
             
            axiosInfos.file = Form
             
        }  
          this.postVideo({axiosInfos, onUploadProgress}).then(res => {
             
            this.getSetVideos(this.$cookies.get('token')).then(videos => {
                this.showTardis = false
                this.salving = false
               

                this.countVideo = this.countVideo - 1
                this.prossesing = false
                this.videoErr = ''
              if (this.countVideo === 0) {
                this.uploading = false
                this.completed = true
                
              }
            }).catch(erro => {
               

               this.videoErr = erro
              this.countVideo = this.countVideo - 1
              this.salving = false

            })
          }).catch(err =>{
             

            let status = document.querySelector('.status')
             
            this.showTardis = false
            if (this.countVideo === 0) {
              this.uploading = true,
              this.completed = false
              
            }
            this.videoErr = err.response.data.err
            this.prossesing = false
            this.prossesing = false
          this.salving = false
          this.converting = false
            this.countVideo = this.countVideo - 1
             
          }) 
      }
      catch(err) {
         

        this.prossesing = false
        this.salving = false
        this.converting = false
        this.videoErr = err.err
        this.countVideo = this.countVideo - 1

      }

    },
    getAxiosHeaders(){
      return {
        headers: {
          authorization: this.$cookies.get('token'),

        }
      }
    },
    getAxiosConfigForUploadVideo(Form) {
      let axiosInfos = {
        file: Form,
        thumb: {},
        getprogressAndSetHeaders: {
          onUploadProgress(event) {
            this.showTardis = false
            let progress = Math.round((event.loaded * 100) / event.total)
            // 
            let progressBar = document.querySelector('.progress')
            let progressPorcent = document.querySelector('.porcent')
            let status = document.querySelector('.status')
            //status.innerHTML === 'enviando arquivo' ? status.innerHTML = status.innerHTML : status.innerHTML = 'enviando arquivo'
            progressBar.style.width = `${progress}%`
            progressPorcent.innerHTML = `${progress}%` //inner para matar as saudades
            this.videoErr = ''
            this.uploading = true
            if (progress === 100) {
              this.salving = true
              this.videoErr = ''
              this.showTardis = true

            }
          },
          headers: {
            authorization: this.$cookies.get('token'),
            "content-type": "multipart/form-data",

          }
        }
      }
      return axiosInfos
    },
    areYouSure($event){
      this.$emit('question', $event)
    },
    deleteVideo(){
       
    }
  },
};
</script>

<style scoped>
#videos {
  flex: 1;
  max-width: 500px;
  min-width: 396px;
  margin: 100px 20px;
  background-color: var(--corMenu);
  min-height: 396px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
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
  position: relative;
}
*>>>.arrow {
    left: 3%;
    top: 50%;
    transform: translate(20%, -50%);
}
*>>>.arrow a {
  color: white;
}
*>>>.arrow a:active {
  color: var(--cor6)
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
*>>> .videosUploading {
    left: 100%;
    transform: translate(14px,3px);
    color: var(--cor7);
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
*>>> .tardis-processing{
  transform: translate(-50%, 38%)
}
*>>> .hidden {
  display: none;
}
*>>> .delete {
  cursor: pointer;

}
*>>> .delete:hover {
  cursor: pointer;
  color: var(--cor6);
  
}
@media screen and (max-width: 400px) {
    #videos {
          flex: 1;
          max-width: 500px;
          min-width: 350px;
          margin: 0px 0px;
          background-color: var(--corMenu);
          min-height: 396px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
}
</style>