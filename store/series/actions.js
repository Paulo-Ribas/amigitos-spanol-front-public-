export default{
    async getEps(context,playload){
        try {
            let eps = await this.$axios.$get('https://dw-api.com.br/eps')
            return eps
        } catch (error) {
            throw error
        }
    },
    async getTemps(context,payload){
        try {
            let temps = await this.$axios.$get("https://www.dw-api.com.br/temps")
            return temps  
        } catch (error) {
            throw error
        }
    },
    async getEp(context,payload){
        let Ep = payload.ep
        let temp = payload.temp 
        console.log(payload, Ep)
        temp === undefined ? temp = '' : temp
        try {
            let ep = await this.$axios.$get(`https://dw-api.com.br/ep/${Ep}/${temp}`)
            console.log('a resposta', ep, ep.data, ep.data[0])
            return ep.data[0]
        } catch (error) {
            throw error
        }
    }, async getTemp(context, payload){
        let tempPayload = payload.temp
        try {
            let temp = await this.$axios.$get(`https://dw-api.com.br/temp/${tempPayload}`)
            return temp
        } catch (error) {
            throw error
        }
    }

}