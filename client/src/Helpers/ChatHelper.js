import { createContext, useContext } from "react";
import { getCurrentTime } from "./HelperFunctions"
import { authContext } from "../Auth/AuthContext";
import { currentChatContext } from "../Store/CurrentChat";
import { contactListContext } from "../Store/ContactList";
import { isAlreadyInContactList, addToContactList, findOneUser } from "./HelperFunctions";

//CONTEXT
export const chatHelper = createContext(null)
//CONTEXT PROVIDER
export const ChatHelperProvider = ({ children }) => {
    const { socket, user } = useContext(authContext)
    const { currentChat } = useContext(currentChatContext)
    const { contactsList, setContactsList } = useContext(contactListContext)

    const sendMessage = async (message, senderId, recieverId) => {
        return new Promise((resolve) => {
            const currentHoursAndMinutes = getCurrentTime()
            socket.current.emit("sendMessage", {
                senderId,
                recieverId,
                msg: message,
                time: currentHoursAndMinutes
            })
            const messageObj = {
                message,
                senderId,
                isYours: true,
                recieverId,
                time: currentHoursAndMinutes
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
            time: msgObj.time
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
            isAlreadyInContactList(contactsList, arrivalMessage.senderId).then((newContact) => {
                if (newContact) {
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

    return (
        <chatHelper.Provider value={{ sendMessage, recieveMessage, setOnlineStatusHelper, actionsWhenNewMessage }} >
            {children}
        </chatHelper.Provider>
    )
}