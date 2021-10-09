import React, { useState, useEffect, useCallback, useContext } from 'react';
import { WeatherMap, ErrorModal } from './Components'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { axiosinstance } from './config'
import { convertkelvintocelcius, properformattedtime, UserisonlineContext } from './utils'
import { useModal, useOnlineConnectivityCheck } from './Hooks'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Alert } from 'react-bootstrap';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

function App() {
  const [weatherlocation, changeweatherlocation] = useState("")
  const [modal, , hidemodal, message, , showmodalwithmessage] = useModal()
  const [weatherdata, saveweatherdata] = useState({})
  const [coordinates, changecoordinates] = useState([23.2667, 77.4])
  const isonline = useContext(UserisonlineContext)
  const onlinecheck = useOnlineConnectivityCheck(isonline, weatherdata)

  const MakeApiRequest = useCallback((currentweatherlocation = "Bhopal") => {
    if (isonline !== true) {
      showmodalwithmessage("You are offline. Please check your Internet Connection.")
      return
    }
    axiosinstance.post(`/getlocatondata/${currentweatherlocation}`).then(({ data }) => {
      const { coord: { lat, lon }, weather: [{ icon, description }], wind: { speed }, main: { temp, temp_min, temp_max, humidity }, sunrisetime, sunsettime } = data

      saveweatherdata({ name: currentweatherlocation, icon, sunrisetime: properformattedtime(sunrisetime), sunsettime: properformattedtime(sunsettime), description, speed, temperature: convertkelvintocelcius(temp), minimum_temperature: convertkelvintocelcius(temp_min), maximum_temperature: convertkelvintocelcius(temp_max), humidity })
      changecoordinates([lat, lon])
    }).catch(() => {
      showmodalwithmessage("Sorry weather data for your location could not be found")
    })
  }, [showmodalwithmessage, isonline])

  const findweatherforalocation = () => {
    const currentweatherlocation = weatherlocation.trim()
    if (currentweatherlocation.length === 0) {
      showmodalwithmessage("Input field cannot be empty")
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

  const props = { modal, hidemodal, message }
  return (
    <div >
      {
        onlinecheck === true ?
          <>
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
            {
              Object.keys(weatherdata).length > 0 &&
              <div className="mt-3 d-flex justify-content-center">
              <Alert variant="info">
                <div>
                  <h5><p>Contact developer</p></h5>
                  <div className="d-flex justify-content-center">
                    <a rel="noreferrer" href="https://twitter.com/ashwin_nema" target="_blank"><TwitterIcon color="primary" ></TwitterIcon>  </a>
                    <a rel="noreferrer" href="https://www.linkedin.com/in/ashwin-nema-4223671a5/" target="_blank"><LinkedInIcon color="primary" ></LinkedInIcon>  </a>
                  </div>
                </div>
              </Alert>

            </div>
            }
            <ErrorModal {...props} />
          </> :

          <div className="d-flex justify-content-center mt-5">
            <Alert variant="danger">
              <ErrorRoundedIcon style={{ color: "red" }} />
              You are offline. Please check your Internet Connection.
            </Alert>
          </div>
      }
    </div>
  );
}

export default App;