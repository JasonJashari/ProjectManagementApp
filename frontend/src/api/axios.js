import axios from 'axios'
const BASE_URL = 'https://projectmanagementapp-b1819bc02f67.herokuapp.com/'

export default axios.create({
    baseURL: BASE_URL
})

// export const axiosPrivate = axios.create({
//     baseURL: BASE_URL,
//     headers: { 'Content-Type': 'application/json' },
//     withCredentials: true
// })