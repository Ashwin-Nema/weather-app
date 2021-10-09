import { useEffect, useState } from "react";

export const useOnlineConnectivityCheck = (online, weatherdata) => {
    const [UserisonlineContext, changeonlinestatus] = useState(online)
    useEffect(() => {
        if (Object.keys(weatherdata).length === 0 && !online) {
            changeonlinestatus(false)
            return
        }
        if (!online) {
            changeonlinestatus(true)
        }
    },[changeonlinestatus, weatherdata, online])

    return UserisonlineContext
}