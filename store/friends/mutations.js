export default {
    SET_FRIENDS_AND_REQUESTS(state, payload){
         
        let {friends, requests} = payload
        state.friends = friends
        state.requests = requests
         
        return 
    }
}