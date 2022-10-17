import {createContext, useState, useRef} from "react";

export const userContext = createContext(null)


export const UserContextProvider = ({children}) => {
    const [user,setUser] = useState()
    const socket = useRef(null)
    return(
        <userContext.Provider value={{user,setUser,socket}} >
            {children}
        </userContext.Provider>
    )
}
