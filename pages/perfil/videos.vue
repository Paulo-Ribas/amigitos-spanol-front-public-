<template>
  <div id="videos" v-if="!loanding">
    <h2>Videos</h2>
    <div class="tabble">
      <table>
        <tbody>
          <tr v-for="video in videos" :key="video.name">
            <td><img src="/default.png" /></td>
            <td colspan="1">{{ video.fileName }}</td>
            <td class="delete" @click="areYouSure">Deletar</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="progress-bar" v-if="uploading">
      <span>enviando arquivo</span>
      <span class="porcent">0%</span>
      <div class="progress"></div>
    </div>
    <button @click="clickInput" class="add-videos">Adicionar Video</button>
    <input type="file" hidden id="file" @change="uploadVideo"/>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "qeqw",
  beforeMount() {
    this.token = localStorage.getItem("token");
    axios.get("http://localhost:3333/videos", {
        headers: { authorization: "bearer " + this.token },
      }).then((res) => {
        let videosArray = res.data.videos;
        this.videos = videosArray;
        console.log(res, 'cade a resposta')
      })
      .catch((res) => {
        console.log(res);
      });
  },
  mounted() {
    this.loanding = false
  },
  data() {
    return {
      videos: [],
      token: undefined,
      loanding: true,
      uploading: false
    };
  },
  methods: {
    clickInput() {
      let input = document.getElementById("file");
      input.click();
    },
    uploadVideo() {
      const Form = new FormData();
      let file = document.getElementById("file");
      Form.append("video", file.files[0]);
      this.uploading = true
      let config = {
        headers: { authorization: "bearer " + this.token },
        onUploadProgress(event){
            let progress = Math.round((event.loaded * 100) / event.total)
            let progressBar = document.querySelector('.progress')
            let progressPorcent = document.querySelector('.porcent')
            progressBar.style.width = `${progress}%`
            progressPorcent.innerHTML = `${progress}%` //inner para matar as saudades
            if(progress === 100) {
              this.token = localStorage.getItem("token");
    axios.get("http://localhost:3333/videos", {
        headers: { authorization: "bearer " + this.token },
      }).then((res) => {
        let videosArray = res.data.videos;
        this.videos = videosArray;
        console.log(res, 'cade a resposta')
      })
      .catch((res) => {
        console.log(res);
      });
            }
            
        }
      }
      axios.post("http://localhost:3333/video", Form, config).then((res) => {
          console.log(res);
        })
        .catch((res) => {
          console.log(res);
        });
    },
    areYouSure(){
      this.$emit('question')
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
*>>> .tabble {
  overflow-y: scroll;
  width: 100%;
  padding: 0px 5px;
  font-family: cursive;
  max-height: 230px;
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