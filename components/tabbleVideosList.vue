<template>
  <div class="tabble">
    <BtnSpecial :btnProps="propsForBtn" v-if="selectAll" @clicked="selectAndDeselectToggle()"></BtnSpecial>
      <table>
         <tbody>
          <tr v-for="(video, index) in videos" :key="video.name">
            <td class="img"><img :src="video.thumbnailLocation" /></td>
            <td colspan="1" class="videoName"> {{ video.fileName }}</td>
            <td class="btn" :data-video="index" @click="areYouSure($event)">{{btn}}</td>
          </tr> 
          </tbody>
       </table>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return {
            videos: this.$props.videosProps,
            btn: this.$props.btnProps,
            selectAll: this.$props.selectAllProps,
            propsForBtn: 'Selecionar Tudo',
            selectedAll: false,
        }
    },
    props: {
        videosProps: Array,
        btnProps: String,
        selectAllProps: Boolean,
    },
    watch: {
      videosProps(value, payload){
         
        this.videos = value


      },
    },
    methods:{
      areYouSure(event){
        const indexValue = event.target.attributes['data-video'].value
        const index = parseInt(indexValue)
        const video = this.videos[index]
        this.$emit('selected',{video: video, target: event.target, father: event.target.parentElement})
      },
      selectAndDeselectToggle(){
        if(!this.selected) {
          this.removeAll()
          return
        }
        this.selectedAll()
      },
      selectedAll(event){
        this.selected = true,
        this.propsForBtn = 'Desselecionar Tudo'
        this.$emit('selectedAll')
        
      },
      removeAll(){
        this.selected = false
        this.propsForBtn = 'Selecionar Tudo'
        this.$emit('deselectAll')
      },
      createImgUrl(base64){
        let arrayBlob = Buffer.from(base64, 'base64')
        let blob = new Blob(arrayBlob)
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    }

}
</script>

<style scoped>
  td {
  color: var(--cor2);
  font-family: cursive;
  padding: 0px 2px;
}
tr {
  margin: 2px 0px;
  background-color: var(--cor4);
}
td img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
  *>>> td {
  color: var(--cor2);
  font-family: cursive;
  padding: 0px 2px;
  word-break: break-word;
}
*>>> tr {
  margin: 2px 0px;
  background-color: var(--cor4);
}
*>>> td img {
  width: 50px;
  height: 50px;
}
  table {
    width: 100%;
  }
 .tabble {
  overflow-y: scroll;
  width: 100%;
  padding: 0px 5px;
  font-family: cursive;
  max-height: 230px;
}
*>>> .videoName{
  max-height: 50px;
  max-width: 360px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
*>>> table {
  width: 100%;
}
*>>> .tabble {
  border-collapse: collapse;
  overflow-y: scroll;
  width: 100%;
  padding: 0px 5px;
  font-family: cursive;
  max-height: 230px;
}

.img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn {
  text-align: center;
  cursor: pointer;
  word-break: keep-all;
}
.btn:hover {
  cursor: pointer;
  color: var(--cor6);
}
.selected{
  color: var(--cor9)
}
@media screen and (max-width: 500px) {
  .videoName {
    max-height: 50px;
    max-width: 224px !important;
  }
  
}
</style>