export default {
    SET_TOKEN(state, payload){
        this.$cookies.remove('token')
        this.$cookies.set('token', payload, {
            path: '/',
            maxAge:  60 * 60 * 24 * 4,
        })
        console.log('token setado = ', this.$cookies.getAll('token'))
    },
    REMOVE_TOKEN(state, payload){
        console.log('apagando o token', this.$cookies.getAll('token'))
        this.$cookies.removeAll()
    },
    SET_VIDEOS(state, payload){
        state.videos = payload
    },
    SET_USER_INFO(state, payload){
        let { username, email, profileimg, emoji, id} = payload
        state.id = id
        state.userName = username,
        state.email = email,
        state.profileimg = profileimg,
        state.emoji = emoji
        
    }
}