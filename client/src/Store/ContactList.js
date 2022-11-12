import { createContext, useState } from "react";

export const contactListContext = createContext(null)

export const ContactListContextProvider = ({ children }) => {
    const [contactsList, setContactsList] = useState([])
    return (
        <contactListContext.Provider value={{ contactsList, setContactsList }} >
            {children}
        </contactListContext.Provider>
    )
}