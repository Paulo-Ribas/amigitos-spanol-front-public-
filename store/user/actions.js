export default {
    getUserData(context, payload) {
        let {srcImg,email, userName, emoji } = context.state
        let user = {token, srcImg, email, userName, emoji}
        return user

    },
    async validateUser(context, payload){
        try {
            let user = await this.$axios.$post(`${this.$config.dev_url}validate`,{},{headers:{authorization: payload}})
            console.log(user, 'o useeeeeer')
            return user.dates
        } 
        catch(error){
            context.commit('REMOVE_TOKEN')
            throw new Error(error)
          
        }
    },
    async postVideo(context, payload){
        let axiosInfos = payload
        try {
            let post = this.$axios.$post(`${this.$config.dev_url}video`, axiosInfos.file, axiosInfos.getprogressAndSetHeaders)
            return post
            
        } catch (error) {
            return error
        }
    },
    async getSetVideos(context,payload){
        try {
            let res = await this.$axios.$get(`${this.$config.dev_url}videos`, {headers: { authorization: payload}})
            console.log('res', res)
            let videosArray = res.videos
            context.commit('SET_VIDEOS', videosArray)
            return videosArray
            
        } catch (error) {
            console.log(error, 'qual o erro? lol');
            
        }
    },
    async editUserName(context, payload){
        let token = payload.token
        let username = payload.userName
        let email = payload.email
        let config = {
            headers:{
                authorization: token
            }
        }
        try{
            let res = await this.$axios.$put(`${this.$config.dev_url}userName`,{username, email}, config)
            console.log('por que aqui?', res)
            return res.token
            
        }
        catch(error) {
            console.log("ué???????")
            throw new Error(error.response.data); //20/08/2022, try/catch, then.catch/ throw error, tudo dominado agora.
        }
    },
    async editImg(context, payload) {
        let token = payload.token
        let imagem = payload.imagem
        let config = {
            headers: {
                "Content-Type": "multipart/form-data",
                authorization: token,

            }
        }
        try {
            let res = await this.$axios.$put(`${this.$config.dev_url}profileImg`, {imagem}, config)
            console.log('por que aqui?', res)
            return res.token

        }
        catch (error) {
            console.log("ué???????")
            throw new Error(error.response.data); //20/08/2022, try/catch, then.catch/ throw error, tudo dominado agora.
        }
    },
    async editUserEmail(context, payload) {
        let token = payload.token
        let email = payload.email
        let newEmail = payload.newEmail
        let config = {
            headers: {
                authorization: token
            }
        }
        try {
            let res = await this.$axios.$put(`${this.$config.dev_url}email`, {email, newEmail}, config)
            console.log('por que aqui?', res)
            return res.token

        }
        catch (error) {
            console.log("ué???????")
            throw new Error(error.response.data); //20/08/2022, try/catch, then.catch/ throw error, tudo dominado agora.
        }
    },
    async editUserPassword(context, payload) {
        let token = payload.token
        let password = payload.password
        let email = payload.email
        let config = {
            headers: {
                authorization: token
            }
        }
        try {
            let res = await this.$axios.$put(`${this.$config.dev_url}password`, { password, email }, config)
            console.log('por que aqui?', res)
            return res.token

        }
        catch (error) {
            console.log("ué???????")
            throw new Error(error.response.data); //20/08/2022, try/catch, then.catch/ throw error, tudo dominado agora.
        }
    },
    async postRoom(context, payload){
        let dates = payload.roomData
        let config = {
            headers: {
                authorization: payload.token
            }
        }
        try {
            let room = await this.$axios.$post(`${this.$config.dev_url}room`,dates,config)
            return room.param
            
        } catch (Error) {
            throw new Error({ name: 'axioslol', message: 'error.response.data' })
        }
    },
    async getRoom(context, payload) {
        console.log(payload, 'room')
        try {
            let room = await this.$axios.$get(`${this.$config.dev_url}` + 'room/' + `${payload}`)
            return room
            
        } catch (error) {
            throw new Error(error)
        }
    },
    async joinRoomByPassword(context, payload){
        let {password, roomUrl} = payload
        let config = {headers:{
            authorization: payload.token
        }}
        let isCorrect = await this.$axios.$post(this.$config.dev_url + 'joinRoom', {password, roomUrl}, config)
        return isCorrect
    },
    async deleteVideo(context, payload){
        let token = payload.token
        let video = payload.video
        console.log('console do payload delete', payload)
        let config = {
            headers: {
                authorization: token
            }
        }
        try {
            console.log('entrou aqui')
            let deleted = await this.$axios.$delete(`${this.$config.dev_url}video/${video.file}`,config)
            console.log(deleted, 'to recebendo resposta?')
            return deleted
            
        } catch (error) {
            throw new Error(error)
        }
        

    }

}