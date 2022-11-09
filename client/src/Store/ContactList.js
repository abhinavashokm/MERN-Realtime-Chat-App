import { createContext, useState } from "react";

export const contactListContext = createContext(null)

export const ContactListContextProvider = ({ children }) => {
    const [contactsList, setContactsList] = useState([])
    const [allUsers, setAllUsers] = useState([])
    return (
        <contactListContext.Provider value={{ contactsList, setContactsList, allUsers, setAllUsers }} >
            {children}
        </contactListContext.Provider>
    )
}