import axios from "axios";
// 'https://weather-app-97.herokuapp.com/'
// 'http://localhost:5000'
export const axiosinstance = axios.create({
    baseURL:'http://localhost:5000'
})