export default {
    getUserData(context, payload) {
        let {srcImg,email, userName, emoji } = context.state
        let user = {token, srcImg, email, userName, emoji, description}
        return user

    },
    async validateUser(context, payload){
         
        let token = payload
         
        try {
            let user = await this.$axios.$post(`validate`,{},{headers:{authorization: token}})
            return user.dates
        } 
        catch(error){
             
            context.commit('REMOVE_TOKEN')
            throw error
          
        }
    },
    async setState(context, payload){
        const token = this.$cookies.get('token')
        try {
            let user = await context.dispatch('validateUser', token)
            context.commit('SET_USER_INFO', user)
            return user
        } catch (error) {
            throw error
        }
    },
    async createThumbnail(context, payload){
        let headers = payload.axiosInfos.getprogressAndSetHeaders.headers
        try {
            let thumbnail = await this.$axios.$post('makeThumbnail', payload.axiosInfos.file, { headers, responseType: 'blob' })
            return thumbnail
        } catch (error) {
            throw error
        }
    },
    async saveThumbnail(context, payload){
        let headers = payload.headers
        let { name, thumbnail } = payload
        let dates = {
            name,
            thumb: thumbnail
            
        }
         
        try {
            let thumbnailResponse = await this.$axios.$post('thumbnail',dates, headers)
             
            return thumbnailResponse.thumbnail
        } catch (error) {
             
            throw error
        }
    },
    async convertVideo(context, payload){
        let headers = payload.axiosInfos.getprogressAndSetHeaders.headers
         
        try {
            let video = await this.$axios.$post('convertVideo', payload.axiosInfos.file, {headers, responseType: 'blob' })
            return video
        } catch (error) {
            throw error
        }
    },
    async postVideo(context, payload){
         
        let headers = payload.axiosInfos.getprogressAndSetHeaders.headers
        let onUploadProgress = payload.onUploadProgress
        try {
            let post = await this.$axios.$post('video', payload.axiosInfos.file, {headers, onUploadProgress})
             
            return post
            
        } catch (error) {
            throw error
        }
    },
    async getSetVideos(context,payload){
        try {
            let res = await this.$axios.$get(`videos`, {headers: { authorization: payload}})
            let videosArray = res.videos
            context.commit('SET_VIDEOS', videosArray)
            return videosArray
            
        } catch (error) {
             
            
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
            let res = await this.$axios.$put(`userName`,{username, email}, config)
             
            return res.token
            
        }
        catch(error) {
             
            throw new Error(error.response.data); //20/08/2022, try/catch, then.catch/ throw error, tudo dominado agora.
        }
    },
    async editImg(context, payload) {
        let token = payload.token
        let imagem = payload.imagem
        console.log('indo editar')
        let config = {
            headers: {
                "Content-Type": "multipart/form-data",
                authorization: token,

            }
        }
        try {
            let res = await this.$axios.$put(`profileImg`, {imagem}, config)
             
            return res.token

        }
        catch (error) {
             console.log('o  grande erro', error)
            throw error.response.data; //20/08/2022, try/catch, then.catch/ throw error, tudo dominado agora.
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
            let res = await this.$axios.$put(`email`, {email, newEmail}, config)
             
            return res.token

        }
        catch (error) {
             
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
            console.log('indo editar', password, email)
            let res = await this.$axios.$put(`password`, { password, email }, config)
             
            return res.token

        }
        catch (error) {
             console.log(error, 'grande erro')
            throw error.response.data; //20/08/2022, try/catch, then.catch/ throw error, tudo dominado agora.
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
            let room = await this.$axios.$post(`room`,dates,config)
            return room.param
            
        } catch (Error) {
            throw Error.response.data.err
        }
    },
    async getRoom(context, payload) {
         
        try {
            let room = await this.$axios.$get('room/' + `${payload}`)
            return room
            
        } catch (error) {
            throw error
        }
    },
    async joinRoomByPassword(context, payload){
        let {password, roomUrl} = payload
        let config = {headers:{
            authorization: payload.token
        }}
        let isCorrect = await this.$axios.$post('joinRoom', {password, roomUrl}, config)
        return isCorrect
    },
    async deleteVideo(context, payload){
        let token = payload.token
        let video = payload.video
        let decodedName = decodeURI(video.file)

         
        let config = {
            headers: {
                authorization: token
            }
        }
        try {
             
            let deleted = await this.$axios.$delete(`video/${decodedName}`,config)
             
            return deleted
            
        } catch (error) {
            throw error
        }

    },
    async sendRecoveryToken(context, payload){
        let email = payload
        try {
            let sent = await this.$axios.$post(`forgetedpass`, {email})
            return sent
            
        } catch (error) {
            throw error
        }
    
    },
    async changePasswordByToken(context, payload){
        let {email, password, token} = payload
        try {
            let changed = await this.$axios.$put(`changepasswordbytoken/${token}`, {email, password})
            return changed
        }
        catch(err){
            throw err
        }
    },
    async getUserFriends(context, payload){
        let userId = payload.userId
        let friends = await this.$axios.$get(`friends/${userId}`)
         
        return friends.friendList
    },
    async isFriend(context, payload) {
        let friendId = payload.friendId
        let userId = payload.userId
        let getFriend = await this.$axios.$get(`friends/${userId}`)
         
        let friendList = getFriend.friendList
         
        let isFriend = false
        friendList.forEach(friends => {
             if(friends.user_id == friendId || friends.friendsentrequest == friendId) return isFriend = true             
        });
         
        return isFriend

    },
    async verifyIfRequestExist(context, payload){
        let axiosConfig = payload.axiosConfig
        let friendId = payload.friendId
        try {
            let res = await this.$axios.get(`isPeding/${friendId}`, axiosConfig)
            let data = res.data.request
             
            if(data) return true
            else return false
            
        } catch (error) {
             
            throw error
        }
    },
    async verifyIfUserIsTheRequestedUser(context, payload){
        let axiosConfig = payload.axiosConfig
        let friendId = payload.friendId
        let userId = payload.userId
        try {
            let res = await this.$axios.get(`friendRequest/${friendId}`, axiosConfig)
            let data = res.data.request
             
             
            if(!data) return false
            if (data.friend_id == userId) return true
            else return false

        } catch (error) {
             
        }
    
    },
    async verifyAmount(context, payload) {
        let amount = await this.$axios.$get(`friendsAmount/${userId}`)
         
        return amount.friendsAmount 
    },
    async getUserFriendsRequests(context, payload){
        let {userId, axiosConfig} = payload
        let request = await this.$axios.$get(`isPeding/${userId}`, axiosConfig)
         
        return request.request
    },
    async acceptFriendRequest(context, payload){
        let { friendId, axiosConfig } = payload
        try {
            let accepted = await this.$axios.$post('friend', { friendId: friendId }, axiosConfig)
            return accepted
        }
        catch(error) {
            throw error
        }
    },
    async removeFriend(context, payload){
        let {friendId, axiosConfig} = payload
        try {
            let removed = await this.$axios.$delete(`friend/${friendId}`, axiosConfig)
            return removed
            
        } catch (error) {
            throw error
        }
    },
    async refuseRequest(context, payload){
        let { friendId, axiosConfig } = payload
        try {
            let refused = await this.$axios.$delete(`request/${friendId}`, axiosConfig)
            return refused
        } catch (error) {
            throw error
        }
    },

}
