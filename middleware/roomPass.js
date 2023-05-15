export default function(context) {
    context.$axios.$get('room/' + context.route.params.roomId).then(data => {
        function verifyRoom(){
            return Object.keys(data).length === 0
        }
        let vazio = verifyRoom()
        if (!vazio) {
            if (data.room.maxMembers === data.room.members.length) {
                return context.redirect('/room')
            } 
        }
        else {
            return context.redirect('/room/create')
        }
    }).catch(nao => {
        throw nao
    })


}