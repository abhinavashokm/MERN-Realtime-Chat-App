import { createContext, useState } from "react";

export const chatsContext = createContext(null)

export const ChatsContextProvider = ({ children }) => {
    const [chats, setChats] = useState([])
    return (
        <chatsContext.Provider value={{ chats, setChats }} >
            {children}
        </chatsContext.Provider>
    )
}