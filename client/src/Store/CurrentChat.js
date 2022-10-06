import { createContext, useState } from "react";

export const currentChatContext = createContext(null)

export const CurrentChatContextProvider = ({ children }) => {
    const [currentChat, setCurrentChat] = useState()
    return (
        <currentChatContext.Provider value={{ currentChat, setCurrentChat }} >
            {children}
        </currentChatContext.Provider>
    )
}