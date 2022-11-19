import axios from "axios"

const findOneUser = (contactId) => {
    return new Promise((resolve, reject) => {
        axios.post("http://localhost:3001/findOneUser", { userId: contactId }).then((contactDetails) => {
            resolve(contactDetails.data)
        })
    })
}
const addToContactList = (userId, contactDetails) => {
    return new Promise((resolve) => {
        const contact = {
            _id: contactDetails._id,
            FullName: contactDetails.FullName
        }
        axios.post("http://localhost:3001/addNewContact", { userId, contact }).then((newContactList) => {
            console.log("added to contacts")
            resolve(newContactList.data)
        })
    })
}
const isAlreadyInContactList = (contactsList, contactId) => {
    return new Promise((resolve) => {
        if (contactsList.some(contact => contact._id === contactId)) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}
const getContactList = (userId) => {
    return new Promise((resolve) => {
        axios.post("http://localhost:3001/getContactList", { userId: userId }).then((res) => {
            if (!res.data) {
                console.log("something went wrong")
            } else {
                let contacts = res.data.filter(contact => contact._id !== userId)
                resolve(contacts)
            }
        })
    })
}
const getAllUsers = (userId) => {
    return new Promise((resolve) => {
        axios.get("http://localhost:3001/getAllContacts").then((res) => {
            if (!res.data) {
                console.log("something went wrong")
            } else {
                let contacts = res.data.filter(contact => contact._id !== userId)
                resolve(contacts)
            }
        })
    })
}
const checkUnreadMessage = (unreadMessages, contactId) => {
    const unreadMessagesCount = unreadMessages.filter(obj => obj.senderId === contactId).length
    if (unreadMessagesCount < 1) {
        return false
    } else {
        return unreadMessagesCount
    }
}
const checkSelectedChat = (contactId, selectedChatId) => {
    return contactId === selectedChatId
}
const filterUnreadMessages = (unreadMessages, senderId, setUnreadMessages) => {
    if (unreadMessages.some(message => message.senderId === senderId)) {
        const filter = unreadMessages.filter(message => message.senderId !== senderId)
        setUnreadMessages(filter)
    }
}
const getCurrentTime = () => {
    const date = new Date()
    const hours = ("0" + date.getHours()).slice(-2)
    const minutes = ("0" + date.getMinutes()).slice(-2)
    const currentTime = hours + ':' + minutes
    return currentTime
}
const getLastMessage = (contactId, chats) => {
    const lastMessage = [...chats].reverse().find(message => message.senderId === contactId || message.recieverId === contactId)
    return lastMessage
}

const compareFn = (A, B, chats) => {
    const lastMessageOfA = getLastMessage(A._id, chats)
    const lastMessageOfB = getLastMessage(B._id, chats)

    //return positive - a comes after b   :b,a
    //return negative - a comes before b  :a,b
    //return 0        - no changes

    if (lastMessageOfA && lastMessageOfB) {
        //if (b is newest one) result will be positive - b,a (else) result will be negative - a,b
        return new Date(lastMessageOfB.createdAt) - new Date(lastMessageOfA.createdAt);
    } else if (lastMessageOfA && !lastMessageOfB) {
        return -1
    } else if (lastMessageOfB && !lastMessageOfA) {
        return 1
    }else {
        return 0
    }
}


export {
    findOneUser, getContactList, getAllUsers, getCurrentTime,
    addToContactList, isAlreadyInContactList, checkUnreadMessage,
    checkSelectedChat, filterUnreadMessages, getLastMessage,
    compareFn
}