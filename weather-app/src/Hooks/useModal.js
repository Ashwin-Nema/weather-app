import { useState } from "react";

export const useModal = () => {
    const [modal, showmodal] = useState(false)
    const [modalmessage, setmodalmessage] = useState("")
    const hidemodal = () => {
        showmodal(false)
    }
    const showmodalwithmessage = (message) => {
        setmodalmessage(message)
        showmodal(true)
    }
    return [modal,showmodal, hidemodal, modalmessage, setmodalmessage, showmodalwithmessage]
}