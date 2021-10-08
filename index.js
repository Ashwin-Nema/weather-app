const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const axios = require('axios')
const cors = require('cors')
const moment = require('moment-timezone')
require('dotenv').config()
const { REACT_APP_WEATHER_API_KEY } = process.env
const geoTz = require('geo-tz')
const {Extractdata} = require('./Middlewares')

app.use(
    cors({
        origin: 'http://localhost:3000' || process.env.PORT
    })
)

app.post("/getlocatondata/:location", async (req, res) => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${req.params.location}&appid=${REACT_APP_WEATHER_API_KEY}`)
        const { data } = response
        const {coord:{lat, lon}, sys:{sunrise, sunset}} = data
        const [locationtimezone] = geoTz(lat, lon)
        const sunrisetime = moment.tz(sunrise *1000, locationtimezone).format("HH:mm:ss")
        const sunsettime = moment.tz(sunset *1000, locationtimezone).format("HH:mm:ss")
        res.json({...data,locationtimezone, sunrisetime, sunsettime})
    } catch (error) {
        console.log(error)
        res.status(404).send("Data not found")
    }
})

app.post("/getlocatondatabylatlng", async (req, res) => {
    try {
        const {lat, lng} = req.body
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lng}&appid=${REACT_APP_WEATHER_API_KEY}`)
        // const { data } = response
        // const {coord:{lat, lon}, sys:{sunrise, sunset}} = data
        // const [locationtimezone] = geoTz(lat, lon)
        // const sunrisetime = moment.tz(sunrise *1000, locationtimezone).format("HH:mm:ss")
        // const sunsettime = moment.tz(sunset *1000, locationtimezone).format("HH:mm:ss")
        // res.json(response.data)
        res.json(Extractdata(response.data))
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

app.listen(5000, () => console.log("Server Started"))