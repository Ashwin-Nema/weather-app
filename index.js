const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()
const { REACT_APP_WEATHER_API_KEY } = process.env
const {Extractdata} = require('./Middlewares')

app.use(
    cors({
        origin: 'http://localhost:3000' || process.env.PORT
    })
)

app.post("/getlocatondata/:location", async (req, res) => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${req.params.location}&appid=${REACT_APP_WEATHER_API_KEY}`)
        res.json(Extractdata(response.data))
    } catch (error) {
        res.status(404).send("Data not found")
    }
})

app.post("/getlocatondatabylatlng", async (req, res) => {
    try {
        const {lat, lng} = req.body
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${REACT_APP_WEATHER_API_KEY}`)
        res.json(Extractdata(response.data))
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

app.listen(5000, () => console.log("Server Started"))