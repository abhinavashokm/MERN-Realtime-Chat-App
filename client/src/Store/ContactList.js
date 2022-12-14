import { createContext, useState } from "react";

export const contactListContext = createContext(null)

export const ContactListContextProvider = ({ children }) => {
    const [contactsList, setContactsList] = useState([""])
    const [blockedList, setBlockedList] = useState([""])
    return (
        <contactListContext.Provider value={{ contactsList, setContactsList, blockedList, setBlockedList }} >
            {children}
        </contactListContext.Provider>
    )
}