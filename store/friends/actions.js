export default {
    async attFriendsInfoState(context, payload){
         
        let userId = payload
        try {
            let friends = await context.dispatch('getUserFriends', userId)
            let requests = await context.dispatch('getUserRequests', userId)
             
            context.commit('SET_FRIENDS_AND_REQUESTS', {friends, requests})
            return
            
        } catch (error) {
            throw error
        }
    },
    async getUserFriends(context, payload) {
        let userId = payload
        try {
            let friends = await this.$axios.$get(`friends/${userId}`)
             
            return friends.friendList
            
        } catch (error) {
            throw error
        }
    },
    async getUserFriendsInfo(context, payload) {
        let userId = payload
        try {
            let friends = await this.$axios.$get(`userFriendsInfo/${userId}`)
             
            return friends.friendList

        } catch (error) {
            throw error
        }
    },
    async getUserRequests(context, payload) {
        let userId = payload
        let token = this.$cookies.get('token')
        let axiosConfig = {
            headers: {
                authorization: token
            }
        }
         
        try {
            let request = await this.$axios.$get('usersRequests', axiosConfig)
             
            return request.users
            
        } catch (error) {
            throw error
        }
    },
    async acceptFriendRequest(context, payload) {
        let { friendId, axiosConfig } = payload
        try {
            let accepted = await this.$axios.$post('friend', { friendId: friendId }, axiosConfig)
            return accepted
        }
        catch (error) {
            throw error
        }
    },
    async removeFriend(context, payload) {
        let { friendId, axiosConfig } = payload
        try {
            let removed = await this.$axios.$delete(`friend/${friendId}`, axiosConfig)
            return removed

        } catch (error) {
            throw error
        }
    },
    async refuseRequest(context, payload) {
        let { friendId, axiosConfig } = payload
        try {
            let refused = await this.$axios.$delete(`request/${friendId}`, axiosConfig)
            return refused
        } catch (error) {
            throw error
        }
    },
}