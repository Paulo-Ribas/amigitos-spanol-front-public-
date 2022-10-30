export default function (context) {
    if(context.app.$cookies.get('token') === undefined){
        context.redirect('/')
    }    
}