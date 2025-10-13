import http from "../utils/axiosInstance.js";

const serverBase="/index_analysis"
const indexAnalysisServer = {
    getIndexAnalysis () {
        let url = `${serverBase}/security_query/index_yield`
        return http.get(url).then(res => {
            return res
        })
    }
}

export default indexAnalysisServer