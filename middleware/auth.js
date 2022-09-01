export default function (context) {
    console.log(context.app.$cookies.get('token'))
    console.log(context.app.$cookies.get('token'))
    if(context.app.$cookies.get('token') === undefined){
        context.redirect('/')
    }    
}