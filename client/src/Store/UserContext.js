import {createContext, useState} from "react";

export const userContext = createContext(null)

export const UserContextProvider = ({children}) => {
    const [user,setUser] = useState()
    return(
        <userContext.Provider value={{user,setUser}} >
            {children}
        </userContext.Provider>
    )
}
