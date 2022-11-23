import { createContext, useContext } from "react";
import { getCurrentTime } from "./HelperFunctions"
import { authContext } from "../Auth/AuthContext";
import { chatsContext } from "../Store/ChatsContext";
import { currentChatContext } from "../Store/CurrentChat";
import { contactListContext } from "../Store/ContactList";
import { unreadMessagesContext } from "../Store/UnreadMessages";
import { isAlreadyInContactList, addToContactList, findOneUser } from "./HelperFunctions";
import axios from "axios";

//CONTEXT
export const chatHelper = createContext(null)
//CONTEXT PROVIDER
export const ChatHelperProvider = ({ children }) => {
    const { socket, user } = useContext(authContext)
    const { currentChat, setCurrentChat } = useContext(currentChatContext)
    const { contactsList, setContactsList, blockedList, setBlockedList } = useContext(contactListContext)
    const { chats, setChats } = useContext(chatsContext)
    const { unreadMessages, setUnreadMessages } = useContext(unreadMessagesContext)

    const sendMessage = async (message, senderId, recieverId, onlineList) => {
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
            const onlineStatus = onlineList.some(user => user.userId === recieverId)
            const messageObj = {
                message,
                senderId,
                isYours: true,
                recieverId,
                time: currentHoursAndMinutes,
                createdAt: date,
                seen: onlineStatus ? "deliverd" : false
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

        //1 check is the message from a blocked contact
        if (blockedList.some(contact => contact._id === arrivalMessage.senderId)) {
            setArrivalMessage(null)
            return
        }

        //2 update arrivalmessage
        setChats(c => [...c, arrivalMessage])

        //3 check and update unread messages
        if (!currentChat || arrivalMessage.senderId !== currentChat._id) {
            setUnreadMessages(d => [...d, arrivalMessage])
        } else {
            socket.current.emit("messageViewed",
                {
                    recieverId: arrivalMessage.senderId,
                    senderId: arrivalMessage.recieverId
                })
        }

        //4 check is the message from unsaved contact or not, then update the contactList 
        isAlreadyInContactList(contactsList, arrivalMessage.senderId).then((oldContact) => {
            if (!oldContact) {
                findOneUser(arrivalMessage.senderId).then((contactDetails) => {
                    addToContactList(user._id, contactDetails).then((newContactList) => {
                        setContactsList(newContactList)
                    })
                })
            }
        })

        //5 set arrivalMessage state back to null
        setArrivalMessage(null)

    }

    const updateMessageSeen = (contactId) => {
        chats.forEach(element => {
            if (element.isYours && element.recieverId === contactId) {
                element.seen = true
            }
            return element
        })
        setChats(chats)
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

    const blockChat = (contact) => {
        return new Promise((resolve) => {
            axios.post("http://localhost:3001/blockAContact", { contact, userId: user._id }).then((blockList) => {
                setBlockedList(blockList.data)
                resolve(true)
            })
        })
    }

    const unblockChat = (contactId) => {
        return new Promise((resolve) => {
            axios.post("http://localhost:3001/unblockAContact", { contactId, userId: user._id }).then((blockList) => {
                setBlockedList(blockList.data)
                resolve(true)
            })
        })
    }
    const removeViewedUnreadMessages = (contactId) => {
        //clear unreadmessage which seen in this contact
        if (unreadMessages.some(message => message.senderId === contactId)) {

            socket.current.emit("messageViewed",
                {
                    recieverId: contactId,
                    senderId: user._id
                })

            setUnreadMessages(unreadMessages.filter(message => message.senderId !== contactId))
        }
    }

    return (
        <chatHelper.Provider value={{ sendMessage, recieveMessage, setOnlineStatusHelper, actionsWhenNewMessage, removeChat, blockChat, unblockChat, updateMessageSeen, removeViewedUnreadMessages }} >
            {children}
        </chatHelper.Provider>
    )
}