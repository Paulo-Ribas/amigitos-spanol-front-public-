export default {
    SET_TOKEN(state, payload){
        this.$cookies.remove('token')
        this.$cookies.set('token', payload, {
            path: '/',
            maxAge:  60 * 60 * 24 * 4,
        })
         
    },
    REMOVE_TOKEN(state, payload){
         
        this.$cookies.removeAll()
    },
    SET_VIDEOS(state, payload){
        state.videos = payload
    },
    SET_USER_INFO(state, payload){
        let { username, email, profileimg, emoji, id, description} = payload
        state.id = id
        state.userName = username,
        state.email = email,
        state.profileimg = profileimg,
        state.emoji = emoji
        state.description = description
        state.friends = []
        return 
        
    },
    SET_USER_FRIENDS(state, payload){
        let friends = payload
        state.friends = friends
    }
}