export default function(context) {
    console.log('e aqui iria aparecer uma pagina para por a senha, e voce teria que colocar ela, e acertar, se nao, n entra, e se entrar, vai ficar salvo no localStorage')
    context.$axios.$get(context.$config.dev_url + 'room/' + context.route.params.roomId).then(data => {
        function verifyRoom(){
            return Object.keys(data).length === 0
        }
        let vazio = verifyRoom()
        console.log(vazio, 'ta vazio? lol')
        if (!vazio) {
            if (data.room.maxMembers === data.room.members.length) {
                return context.redirect('/room')
            } 
        }
        else {
            console.log('cade o redirect')
            return context.redirect('/room/create')
        }
    }).catch(nao => {
        console.log('nao', nao)
    })


}