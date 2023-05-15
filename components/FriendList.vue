<template>
  <div class="friend-list-container">
    <div class="friend-list-box" v-for="(friend, index) in friendList" :key="index">
        <div class="friend-info">
            <div class="img-container">
                <img :src="friend.profileimg">
            </div>
            <h2 class="name">{{friend.username}}</h2>
        </div>
        <button @click="friendBtnClicked(friend.id)">{{btnText}}</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
    async fetch(){
        try {
            await this.setState()
            await this.attFriendsInfoState(this.user.id)
            this.friendList = await this.getUserFriendsInfo(this.user.id)

        } catch (error) {
            throw error
        }
    },
    fetchOnServer: false,
    data(){
        return {
            btnText: this.$props.btnProps,
            friendList:[]
        }
    },
    props:{
        btnProps:String
    },
    computed: {
        ...mapState({friends: state => state.friends, user: state => state.user}),
    },
    methods: {
        ...mapActions({setState: 'user/setState', attFriendsInfoState: 'friends/attFriendsInfoState', getUserFriendsInfo: 'friends/getUserFriendsInfo'}),
        friendBtnClicked($event){
            this.$emit('btnClicked', $event)

        }
    }
}
</script>

<style scoped>
    .friend-list-container {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    };
    .friend-list-box {
        width: 100%;
        height: 100px;
        margin: 5px 0px;
        display: flex;
    }
    .friend-info {
        width: 100%;
        min-width: 70px;
        max-width: 130px;
        display: flex;
        justify-content: space-evenly;
        position: relative;
    }   
    .img-container {
        width: 80%;
        height: 100%;
        position: relative;
    }
    .img-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-position: center;
        position: absolute;
    }
</style>