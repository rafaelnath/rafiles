import axios from 'axios'

export default () => {
    let url = 'http://localhost:3000'
    if (process.env.NODE_ENV === 'production') {
        url = '/'
    }
    return axios.create({
        baseURL: url
    })
}