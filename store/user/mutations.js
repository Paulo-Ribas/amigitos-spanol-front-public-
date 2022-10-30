export default {
    SET_TOKEN(state, payload){
        console.log(payload,'token diferente?')
        this.$cookies.remove('token')
        this.$cookies.set('token', payload, {
            maxAge:  60 * 60 * 24 * 4,
        })
        console.log('token setado = ', this.$cookies.getAll('token'))
    },
    REMOVE_TOKEN(state, payload){
        console.log('apagando o token')
        this.$cookies.remove('token')
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