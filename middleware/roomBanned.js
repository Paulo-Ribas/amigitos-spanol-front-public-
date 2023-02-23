export default async function (context) {
    try {
        let {room} = await context.$axios.$get('room/' + context.route.params.roomId)
        let token = await context.$cookies.get('token')
        let user = await context.$axios.$post('validate',{}, {headers: {authorization: token}})
        
        let isBanned = room.banneds.find(member => {
             return member.id === user.dates.id
        })
        console.log(user, isBanned, room, room.banneds)

        if(!user.dates) return context.redirect('/')
        if(isBanned) throw  {message: 'você foi banido dessa sala'}

        
    } catch (error) {
        console.log('o erro',error.message);
        let err = error.message
        context.redirect('/room', {
            statusCode: 302,
            query: {
                data: err
            }
})
    }

    
}