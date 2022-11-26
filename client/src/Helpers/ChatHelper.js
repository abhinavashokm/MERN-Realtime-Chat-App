import { createContext, useContext } from "react";
import { getCurrentTime } from "./HelperFunctions"
import { authContext } from "../Auth/AuthContext";
import { chatsContext } from "../Store/ChatsContext";
import { currentChatContext } from "../Store/CurrentChat";
import { contactListContext } from "../Store/ContactList";
import { unreadMessagesContext } from "../Store/UnreadMessages";
import { addToContactList, findOneUser, getContactList } from "./HelperFunctions";
import axios from "axios";

//CONTEXT
export const chatHelper = createContext(null)
//CONTEXT PROVIDER
export const ChatHelperProvider = ({ children }) => {
    const { socket, user } = useContext(authContext)
    const { currentChat, setCurrentChat } = useContext(currentChatContext)
    const { setContactsList, blockedList, setBlockedList } = useContext(contactListContext)
    const { chats, setChats } = useContext(chatsContext)
    const { unreadMessages, setUnreadMessages } = useContext(unreadMessagesContext)

    const sendMessage = async (message, senderId, recieverId, onlineList) => {
        return new Promise((resolve, reject) => {
            const currentHoursAndMinutes = getCurrentTime()
            const date = new Date()
            const recieverIsOnline = onlineList.some(user => user.userId === recieverId)

            const messageObj = {
                message,
                senderId,
                isYours: true,
                recieverId,
                time: currentHoursAndMinutes,
                createdAt: date,
                seen: recieverIsOnline ? "deliverd" : false
            }
            if (recieverIsOnline) {
                socket.current.emit("sendMessage", {
                    senderId,
                    recieverId,
                    msg: message,
                    time: currentHoursAndMinutes,
                    createdAt: date
                })

                resolve(messageObj)
            } else {
                reject(messageObj)
            }
        })
    }
    const addToPendingMessages = (messsageObj, pendingMessages, setPendingMessages) => {
        if (!(pendingMessages.some(element => element.contactId === messsageObj.recieverId))) {
            setPendingMessages(c => [...c,
            {
                contactId: messsageObj.recieverId,
                messages: [messsageObj]
            }
            ])
        } else {
            const objIndex = pendingMessages.findIndex(element => element.contactId === messsageObj.recieverId)
            if (pendingMessages[objIndex].messages) {
                pendingMessages[objIndex].messages.push(messsageObj)
            }

        }
    }
    const sendPendingMessagesHelper = (onlineList, pendingMessages) => {
        pendingMessages.forEach((obj, index) => {
            const finded = onlineList.some(user => user.userId === obj.contactId)
            if (finded) {
                const messagesToSend = pendingMessages[index].messages
                messageDeliverdUpdate(obj.contactId)
                messagesToSend.forEach(async (message) => {
                    await sendPendingMessage(message).then(() => {
                        pendingMessages.splice(index, 1)
                    })
                })
            }
            return
        })
    }
    const messageDeliverdUpdate = (contactId) => {
        chats.forEach((element) => {
            if (element.recieverId === contactId) {
                element.seen = "deliverd"
            }
        })
    }
    const sendPendingMessage = (messageObj) => {
        return new Promise((resolve) => {
            socket.current.emit("sendMessage", {
                senderId: messageObj.senderId,
                recieverId: messageObj.recieverId,
                msg: messageObj.message,
                time: messageObj.time,
                createdAt: messageObj.createdAt
            })
            resolve()
        })
    }
    const recieveMessage = (msgObj, setChats, setUnreadMessages) => {
        const arrivalMessage = {
            message: msgObj.msg,
            senderId: msgObj.senderId,
            recieverId: msgObj.recieverId,
            isYours: false,
            time: msgObj.time,
            createdAt: msgObj.createdAt
        }
        actionsWhenNewMessage(arrivalMessage, setChats, setUnreadMessages)
    }
    const actionsWhenNewMessage = (arrivalMessage, setChats, setUnreadMessages) => {

        //1 check is the message from a blocked contact
        if (blockedList.some(contact => contact._id === arrivalMessage.senderId)) {
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
        isAlreadyInContactList(arrivalMessage.senderId).then((oldContact) => {
            if (!oldContact) {
                findOneUser(arrivalMessage.senderId).then((contactDetails) => {
                    addToContactList(user._id, contactDetails).then((newContactList) => {
                        setContactsList(newContactList)
                    })
                })
            }
        })

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
    const isAlreadyInContactList = (contactId) => {
        return new Promise((resolve) => {
            getContactList(user._id).then(({ contacts }) => {

                if (contacts.some(contact => contact._id === contactId)) {
                    resolve(true)
                } else {
                    resolve(false)
                }

            })
        })
    }

    return (
        <chatHelper.Provider value={{
            sendMessage, recieveMessage, setOnlineStatusHelper, actionsWhenNewMessage,
            removeChat, blockChat, unblockChat, updateMessageSeen, removeViewedUnreadMessages,
            sendPendingMessagesHelper, addToPendingMessages, isAlreadyInContactList
        }} >
            {children}
        </chatHelper.Provider>
    )
}