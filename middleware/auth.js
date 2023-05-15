export default async function (context) {
    let token = context.app.$cookies.get('token')
    if(token === undefined){
        context.redirect('/')
    }
}