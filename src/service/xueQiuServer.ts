import cookies from "../utils/cookies.ts";
import http from "../utils/axiosInstance.js";
const serverName = 'xueQiu'

const xueQiuBaseURL = '/xueqiuServer'

const xueQiuServer = {
    saveCookie (cookie: string) {
        cookies.setCookie(serverName, cookie)
    },
    getCookie () {
        return cookies.getCookie(serverName)
    },
    getTimeSeriesData (period, symbol) {
        let cookie = cookies.getCookie(serverName)
        let url =  `${xueQiuBaseURL}/v5/stock/chart/minute.json`
        return http.get(url,{
            params: {
                period: period,
                symbol: symbol
            },
            headers: {
                xueqiucookie: cookie // 动态获取并注入
            },
            withCredentials: true
        }).then(res => {
            return res.data
        })
    }
}
export default xueQiuServer