export default async function (context) {
    try {
        let {room} = await context.$axios.$get('room/' + context.route.params.roomId)
        let token =  context.app.$cookies.get('token')
        console.log(token, 'o meu token au au')

        let user = await context.$axios.$post('validate',{}, {headers: {authorization: token}})
        
        let isBanned = room.banneds.find(member => {
             return member.id === user.dates.id
        })

        if(!user.dates) return context.redirect('/')
        if(isBanned) throw  {message: 'você foi banido dessa sala'}

        
    } catch (error) {
        console.log('espera ai, é aqui o erro???', error)
        let err = error.message
        if(error.response) err = error.response.data.err
        context.redirect(`/room?q=${err}`)
    }

    
}