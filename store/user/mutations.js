export default {
    SET_TOKEN(state, payload){
        console.log(payload,'token diferente?')
        this.$cookies.removeAll()
        this.$cookies.set('token', payload, {
            maxAge:  60 * 60 * 24 * 7,
        })
    },
    REMOVE_TOKEN(state, payload){
        this.$cookies.removeAll()
    },
    SET_VIDEOS(state, payload){
        state.videos = payload
    },
    SET_USER_INFO(state, payload){
        console.log('setando', payload)
        let { username, email, profileimg, emoji, id} = payload
        state.id = id
        state.userName = username,
        state.email = email,
        state.profileimg = profileimg,
        state.emoji = emoji
        
    }
}