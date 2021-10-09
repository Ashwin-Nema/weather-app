import {createContext} from 'react'

export const UserisonlineContext = createContext() 

export const convertkelvintocelcius = (temp) => {
    return parseFloat(temp - 273.15).toFixed(2)
}

export const properformattedtime = (time) => {
    const formattedtime = time.split(":")
    const amapm = formattedtime[0] >= 12 ? "p.m." :"a.m."
    let hours = formattedtime[0] % 12
    hours = hours ? hours.length > 1 ? hours:`0${hours}` :12    
    let minutes = formattedtime[1].length > 1 ? formattedtime[1]:`0${formattedtime[1]}`
    let seconds = formattedtime[2].length > 1 ? formattedtime[2] : `0${formattedtime[2]}`
    return `${hours}:${minutes}:${seconds} ${amapm}`
}

