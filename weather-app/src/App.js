import React, { useState, useEffect, useCallback } from 'react';
import { WeatherMap, ErrorModal } from './Components'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { axiosinstance } from './config'
import { convertkelvintocelcius, properformattedtime } from './utils'
import {useModal} from './Hooks'

function App() {
  const [weatherlocation, changeweatherlocation] = useState("")
  const [modal, showmodal,hidemodal] = useModal()
  const [weatherdata, saveweatherdata] = useState({})
  const [coordinates, changecoordinates] = useState([23.2667, 77.4])

  const MakeApiRequest = useCallback((currentweatherlocation = "Bhopal") => {
    axiosinstance.post(`/getlocatondata/${currentweatherlocation}`).then(({ data }) => {
      const { coord: { lat, lon }, weather: [{ icon, description }], wind: { speed }, main: { temp, temp_min, temp_max, humidity }, sunrisetime, sunsettime } = data

      saveweatherdata({ name: currentweatherlocation, icon, sunrisetime: properformattedtime(sunrisetime), sunsettime: properformattedtime(sunsettime), description, speed, temperature: convertkelvintocelcius(temp), minimum_temperature: convertkelvintocelcius(temp_min), maximum_temperature: convertkelvintocelcius(temp_max), humidity })
      changecoordinates([lat, lon])
    }).catch(() => {
      showmodal(true)
    })
  }, [showmodal])

  const findweatherforalocation = () => {
    const currentweatherlocation = weatherlocation.trim()
    if (currentweatherlocation.length === 0) {
      showmodal(true)
      return
    }
    MakeApiRequest(currentweatherlocation)
  }

  useEffect(() => {
    if (Object.keys(weatherdata).length === 0) {
      MakeApiRequest()
    }
  }, [weatherdata, MakeApiRequest])

  const mapprops = {
    weatherdata, coordinates, saveweatherdata
  }

  const props = {modal,  hidemodal, message:`${weatherlocation.trim() === "" ? "Input field cannot be empty":"Sorry weather data for your location could not be found"}`}
  return (
    <div >
      <div className="d-flex justify-content-center mt-5 mb-3">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-center mb-3">
            <strong>Enter  location:</strong>
          </div>
          <div className="d-flex justify-content-center ">
            <TextField
              size="small"
              value={weatherlocation}
              onKeyPress={(e) => {

                if (e.key === 'Enter') {
                  findweatherforalocation()
                }
              }}

              onChange={(e) => changeweatherlocation(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={findweatherforalocation}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>

        </div>

      </div>

      <div >
        <WeatherMap {...mapprops} />
      </div>
      <ErrorModal {...props} />
    </div>
  );
}

export default App;