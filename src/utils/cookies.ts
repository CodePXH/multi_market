const key_suffix = '_cookie'
const cookies = {
    getCookie: (name) => {
        let cookie = localStorage.getItem(name + key_suffix);
        if (!cookie) {
            cookie = ''
        }
        return cookie
    },
    setCookie: (name, value) => {
        localStorage.setItem(name + key_suffix, value);
    }
}
export default cookies
