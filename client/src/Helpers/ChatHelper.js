import { createContext, useContext } from "react";
import { getCurrentTime } from "./HelperFunctions"
import { authContext } from "../Auth/AuthContext";
import { currentChatContext } from "../Store/CurrentChat";
import { contactListContext } from "../Store/ContactList";
import { isAlreadyInContactList, addToContactList, findOneUser } from "./HelperFunctions";
import axios from "axios";

//CONTEXT
export const chatHelper = createContext(null)
//CONTEXT PROVIDER
export const ChatHelperProvider = ({ children }) => {
    const { socket, user } = useContext(authContext)
    const { currentChat, setCurrentChat } = useContext(currentChatContext)
    const { contactsList, setContactsList } = useContext(contactListContext)

    const sendMessage = async (message, senderId, recieverId) => {
        return new Promise((resolve) => {
            const currentHoursAndMinutes = getCurrentTime()
            const date = new Date()
            socket.current.emit("sendMessage", {
                senderId,
                recieverId,
                msg: message,
                time: currentHoursAndMinutes,
                createdAt: date
            })
            const messageObj = {
                message,
                senderId,
                isYours: true,
                recieverId,
                time: currentHoursAndMinutes,
                createdAt: date
            }
            resolve(messageObj)
        })
    }
    const recieveMessage = (msgObj, setArrivalMessage) => {
        setArrivalMessage({
            message: msgObj.msg,
            senderId: msgObj.senderId,
            recieverId: msgObj.recieverId,
            isYours: false,
            time: msgObj.time,
            createdAt: msgObj.createdAt
        })
    }
    const actionsWhenNewMessage = (arrivalMessage, setArrivalMessage, setChats, setUnreadMessages) => {

        //1 update arrivalmessage
        setChats(c => [...c, arrivalMessage])

        //2 check and update unread messages
        if (!currentChat || arrivalMessage.senderId !== currentChat._id) {
            setUnreadMessages(d => [...d, arrivalMessage])
        }

        //3 check is the message from unsaved contact or not, then update the contactList 
        isAlreadyInContactList(contactsList, arrivalMessage.senderId).then((oldContact) => {
            if (!oldContact) {
                findOneUser(arrivalMessage.senderId).then((contactDetails) => {
                    addToContactList(user._id, contactDetails).then((newContactList) => {
                        setContactsList(newContactList)
                    })
                })
            }
        })

        //4 set arrivalMessage state back to null
        setArrivalMessage(null)

    }
    const setOnlineStatusHelper = (onlineList, setOnlineStatus) => {
        const status = onlineList.some(user => user.userId === currentChat._id)
        setOnlineStatus(status)
    }

    const removeChat = (contactId) => {
        axios.post("http://localhost:3001/removeAContact", { contactId, userId: user._id }).then((res) => {
            setContactsList(res.data)
            setCurrentChat("")
        })
    }

    return (
        <chatHelper.Provider value={{ sendMessage, recieveMessage, setOnlineStatusHelper, actionsWhenNewMessage, removeChat }} >
            {children}
        </chatHelper.Provider>
    )
}