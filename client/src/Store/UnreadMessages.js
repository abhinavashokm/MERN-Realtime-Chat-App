import {createContext, useState} from "react";

export const unreadMessagesContext = createContext(null)


export const UnreadMessageContextProvider = ({children}) => {
    const [unreadMessages, setUnreadMessages] = useState([])
    return(
        <unreadMessagesContext.Provider value={{unreadMessages, setUnreadMessages}} >
            {children}
        </unreadMessagesContext.Provider>
    )
}