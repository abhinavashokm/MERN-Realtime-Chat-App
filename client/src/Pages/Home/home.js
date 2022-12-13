import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Contacts from '../../Components/Contacts/Main/Contacts'
import Chat from '../../Components/Chat/Main/Chat'
import { currentChatContext } from '../../Store/CurrentChat'
import { unreadMessagesContext } from '../../Store/UnreadMessages'
import { chatsContext } from '../../Store/ChatsContext'
import { chatHelper } from '../../Helpers/ChatHelper'
import { authContext } from '../../Auth/AuthContext'
import { useMediaQuery } from 'react-responsive'
import { findOneUser } from '../../Helpers/HelperFunctions'
import './home.css'


function Home() {

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 576px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 577px)' })

  const { user, socket } = useContext(authContext)
  const { currentChat, setCurrentChat } = useContext(currentChatContext)
  const { chats, setChats } = useContext(chatsContext)
  const { setUnreadMessages } = useContext(unreadMessagesContext)
  const { recieveMessage, messageSeenedUpdate, sendPendingMessagesHelper } = useContext(chatHelper)

  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  })

  const [onlineList, setOnlineList] = useState()
  const [messageViewedContact, setMessageViewedContact] = useState()
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [pendingMessages, setPendingMessages] = useState([])

  //socket.io communication
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

  //update online status
  useEffect(() => {
    currentChat && findOneUser(currentChat._id).then((user) => {
      setCurrentChat(user)
    })
  }, [onlineList])

  //recieve message
  useEffect(() => {
    arrivalMessage && recieveMessage(arrivalMessage, setChats, setUnreadMessages)
  }, [arrivalMessage])

  //update message seen status
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

  return (
    <div className='home-container' >
      {((isDesktop) || (!currentChat && isTabletOrMobile)) && <Contacts />}
      {((isDesktop) || (currentChat && isTabletOrMobile)) && <Chat props={{ pendingMessages, setPendingMessages, onlineList }}/>}
    </div>
  )
}

export default Home