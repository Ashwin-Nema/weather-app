import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import React, { useState, useMemo, useEffect, useRef } from 'react';
import L from 'leaflet'
import './index.css'
import { Alert } from 'react-bootstrap';
import { ErrorModal } from '../Error Modal'
import { useModal } from '../../Hooks'
import { axiosinstance } from '../../config'
import { convertkelvintocelcius, properformattedtime } from '../../utils'

function DisplayMap({ map, coordinates }) {

    useEffect(() => {
        const { lat, lng } = map.getCenter()
        const [Latitude, Longtitude] = coordinates

        if (lat !== Latitude || lng !== Longtitude) {
            const newmapLatLng = new L.LatLng(Latitude, Longtitude)
            map.flyTo(newmapLatLng, map.getZoom())
        }
    }, [map, coordinates])

    return (
        <>
        </>
    )
}

export const WeatherMap = ({ coordinates, weatherdata, saveweatherdata }) => {
    const [map, setMap] = useState(null)
    const [modal, , hidemodal, message, , showmodalwithmessage] = useModal()

    const markerref = useRef()
    const tooltipref = useRef()
    const props = { map, coordinates }
    const modalprops = { modal, hidemodal, message }


    useEffect(() => {
        if (map !== null && tooltipref.current !== undefined && tooltipref.current !== null) {
            tooltipref.current._container.style.backgroundColor = "#fff3cd"
            tooltipref.current._container.style.border = "none"
        }
    }, [map])

    const displaymap = useMemo(

        () => (
            <MapContainer
                center={coordinates}
                style={{ height: "75vh" }}
                zoom={10}
                scrollWheelZoom={true}
                whenCreated={setMap}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <Marker ref={markerref} position={coordinates} >
                    <Tooltip ref={tooltipref} offset={[-15, -15]}  direction="top" opacity={1} permanent>

                        {
                            Object.keys(weatherdata).length > 0 &&
                            <>
                                <Alert className="bordernone" variant="warning">
                                    <h3 className="text-center">{weatherdata.name} </h3>
                                    <div className="weathergrid">
                                        <div>
                                            <img src={`https://openweathermap.org/img/wn/${weatherdata.icon}.png`} alt={weatherdata.description} />
                                            <p >{weatherdata.description}</p>
                                            <p>{weatherdata.temperature}°C</p>
                                        </div>

                                        <div className="weatherdatagrid">

                                            <div>
                                                <p>Minimum Temperature:{weatherdata.minimum_temperature}°C </p>
                                                <p>Maximum Temperature:{weatherdata.maximum_temperature}°C </p>
                                            </div>
                                            <div>
                                                <p>Sunrise: {weatherdata.sunrisetime}</p>
                                                <p>Sunset: {weatherdata.sunsettime}</p>
                                            </div>
                                            <div>
                                                <p>Wind Speed: {weatherdata.speed}m/s</p>
                                                <p>Humidity: {weatherdata.humidity}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </Alert>

                            </>
                        }
                    </Tooltip>
                </Marker>

            </MapContainer>
        ),
        [coordinates, weatherdata]
    )

    const findcurrentuserlocation = () => {
        navigator.permissions.query({ name: 'geolocation' })
            .then(
                ({ state }) => {
                    if (state === "denied") {
                        showmodalwithmessage("You have block location access. Please allow location access in the browser.")
                    }



                }
            ).catch(() => {
                showmodalwithmessage("Sorry your current browser does not support location-tracking feature")

            })
        if (map !== undefined && map !== null) {
            try {
                map.locate()
                map.on('locationfound', (e) => {

                    const { lat, lng } = e.latlng

                    axiosinstance.post("/getlocatondatabylatlng", { lat, lng }).then(({ data }) => {
                        const { name, weather: [{ icon, description }], wind: { speed }, main: { temp, temp_min, temp_max, humidity }, sunrisetime, sunsettime } = data
                        map.flyTo(e.latlng, map.getZoom())
                        markerref.current.setLatLng(e.latlng)
                        saveweatherdata({ name, icon, sunrisetime: properformattedtime(sunrisetime), sunsettime: properformattedtime(sunsettime), description, speed, temperature: convertkelvintocelcius(temp), minimum_temperature: convertkelvintocelcius(temp_min), maximum_temperature: convertkelvintocelcius(temp_max), humidity })
                    }).catch(() => {
                        showmodalwithmessage("Sorry location data for your location could not be found")
                    })
                })

            }
            catch (error) {

                showmodalwithmessage("Sorry something went wrong while trying to fetch your location")
            }
        }
    }

    return (
        <>
            <div onClick={findcurrentuserlocation} className="text-info d-flex justify-content-end smalltext">
                Allow location access
            </div>
            {
                map ? <DisplayMap {...props} /> : null
            }
            {displaymap}

            <ErrorModal {...modalprops} />

        </>
    )
}
