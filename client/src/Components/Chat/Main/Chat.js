import React, { useState, useEffect, useContext } from 'react'
import { authContext } from '../../../Auth/AuthContext';
import { currentChatContext } from '../../../Store/CurrentChat';
import { unreadMessagesContext } from '../../../Store/UnreadMessages';
import { contactListContext } from '../../../Store/ContactList';
import { chatsContext } from '../../../Store/ChatsContext';
import { chatHelper } from '../../../Helpers/ChatHelper';
import { addToContactList, findOneUser } from '../../../Helpers/HelperFunctions';
import ChatBox from '../Conditional/ChatBox';
import EmptyChat from '../Conditional/EmptyChat';
import "../Chat.css"

function Chat() {

  const { user, socket } = useContext(authContext)
  const { currentChat, setCurrentChat } = useContext(currentChatContext)
  const { setUnreadMessages } = useContext(unreadMessagesContext)
  const { setContactsList } = useContext(contactListContext)
  const { sendMessage, recieveMessage, messageSeenedUpdate, sendPendingMessagesHelper, addToPendingMessages, isAlreadyInContactList } = useContext(chatHelper)
  const { chats, setChats } = useContext(chatsContext)

  const [onlineList, setOnlineList] = useState()
  const [messageViewedContact, setMessageViewedContact] = useState()
  const [pendingMessages, setPendingMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)

  useEffect(() => {
    if (user) {
      socket.current.on("onlineUsersList", (onlineUsers) => {
        setOnlineList(onlineUsers)
      })

      socket.current.on("recieveMessage", (msgDetails) => {
        setArrivalMessage(msgDetails)
      })

      socket.current.on("messageViewedResponce", (senderId) => {
        setMessageViewedContact(senderId)
      })

      //update online users list
      socket.current.on("usersChange", (users) => {
        setOnlineList(users)
      })

    }
  }, [user, currentChat, socket])

  useEffect(() => {
    arrivalMessage && recieveMessage(arrivalMessage, setChats, setUnreadMessages)
  }, [arrivalMessage])

  useEffect(() => {
    currentChat && findOneUser(currentChat._id).then((user) => {
      setCurrentChat(user)
    })
  }, [onlineList])

  useEffect(() => {
    if (messageViewedContact) {
      messageSeenedUpdate(messageViewedContact)
      setMessageViewedContact(null)
    }
  }, [chats, messageViewedContact])

  //for sending pending messages
  useEffect(() => {
    if (onlineList && onlineList.length > 1 && pendingMessages.length > 0) {
      sendPendingMessagesHelper(onlineList, pendingMessages)
    }
  }, [onlineList])


  //this fucnction for sending private message
  const handleMessageSubmit = async ({ message, setMessage }) => {

    isAlreadyInContactList(currentChat._id).then((oldContact) => {
      if (!oldContact) {
        addToContactList(user._id, currentChat).then((newContactList) => {
          setContactsList(newContactList)
        })
      }
    })

    sendMessage(message, user._id, currentChat._id, onlineList).then((messageObj) => {
      setChats(c => [...c, messageObj])
      setMessage('')
    }).catch((messageObj) => {
      setChats(c => [...c, messageObj])
      addToPendingMessages(messageObj, pendingMessages, setPendingMessages,)
      setMessage('')
    })

  }
  return (
    <div className='Chat-Section' >
      {currentChat
        ? <ChatBox props={{ chats, handleMessageSubmit, onlineList }} />
        : <EmptyChat />
      }
    </div>

  )
}

export default Chat