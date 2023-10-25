export default{
    async getEps(context,playload){
        try {
            let eps = await this.$axios.$get('https://dw-api.com.br/episodes')
            return eps
        } catch (error) {
            throw error
        }
    },
    async getTemps(context,payload){
        try {
            let temps = await this.$axios.$get("https://dw-api.com.br/seasons")
            return temps  
        } catch (error) {
            throw error
        }
    },
    async getEp(context,payload){
        let Ep = payload.ep
        let special = payload.special || 0
        let temp = payload.temp 
         
        temp === undefined ? temp = '' : temp
        try {
            let ep = await this.$axios.$get(`https://dw-api.com.br/episode/${Ep}/${temp}`)
            if(special == 0 )return ep.data[0]
            return ep.data[1]
        } catch (error) {
            throw error
        }
    }, async getTemp(context, payload){
        let tempPayload = payload.temp
        try {
            let temp = await this.$axios.$get(`https://dw-api.com.br/season/${tempPayload}`)
            return temp
        } catch (error) {
            throw error
        }
    }

}