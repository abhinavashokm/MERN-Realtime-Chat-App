import {createContext, useState, useRef} from "react";

export const authContext = createContext(null)


export const AuthContextProvider = ({children}) => {
    const [user,setUser] = useState()
    const socket = useRef(null)
    return(
        <authContext.Provider value={{user,setUser,socket}} >
            {children}
        </authContext.Provider>
    )
}
