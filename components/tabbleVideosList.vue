<template>
  <div class="tabble">
      <table>
         <tbody>
          <tr v-for="(video, index) in videos" :key="video.name">
            <td class="img"><img src="/default.png" /></td>
            <td colspan="1"> {{ video.fileName }}</td>
            <td class="btn" :data-video="index" @click="areYouSure($event)">{{btn}}</td>
          </tr> 
          </tbody>
       </table>
  </div>
</template>

<script>
export default {
    data(){
        return {
            videos: this.$props.videosProps,
            btn: this.$props.btnProps
        }
    },
    props: {
        videosProps: Array,
        btnProps: String
    },
    watch: {
      videosProps(value, payload){
        console.log(value, 'ta mudando')
        this.videos = value

      }
    },
    methods:{
      areYouSure(event){
        const indexValue = event.target.attributes['data-video'].value
        const index = parseInt(indexValue)
        const video = this.videos[index]
        this.$emit('selected',{video: video, target: event.target, father: event.target.parentElement})
      }
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
}
.btn:hover {
  cursor: pointer;
  color: var(--cor6);
}
.selected{
  color: var(--cor9)
}
</style>