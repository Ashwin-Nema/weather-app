const moment = require('moment-timezone')
const geoTz = require('geo-tz')
const Extractdata = (data) => {
    const { coord: { lat, lon }, sys: { sunrise, sunset } } = data
    const [locationtimezone] = geoTz(lat, lon)
    const sunrisetime = moment.tz(sunrise * 1000, locationtimezone).format("HH:mm:ss")
    const sunsettime = moment.tz(sunset * 1000, locationtimezone).format("HH:mm:ss")
    return {...data,locationtimezone, sunrisetime, sunsettime}
}

module.exports = {Extractdata}