import React, { useState, useEffect, useContext } from 'react'
import "./Chat.css"
import { io } from 'socket.io-client';
import { authContext } from '../../Auth/AuthContext';
import { currentChatContext } from '../../Store/CurrentChat';
import { unreadMessagesContext } from '../../Store/UnreadMessages';
import { contactListContext } from '../../Store/ContactList';
import { chatsContext } from '../../Store/ChatsContext';
import { chatHelper } from '../../Helpers/ChatHelper';
import ChatBox from './SubComponents/ChatBox';
import EmptyChat from './SubComponents/EmptyChat';
import { isAlreadyInContactList, addToContactList } from '../../Helpers/HelperFunctions';

function Chat() {

  const { user, socket } = useContext(authContext)
  const { currentChat } = useContext(currentChatContext)
  const { setUnreadMessages } = useContext(unreadMessagesContext)
  const { contactsList, setContactsList } = useContext(contactListContext)
  const { sendMessage, recieveMessage, actionsWhenNewMessage } = useContext(chatHelper)
  const { chats, setChats } = useContext(chatsContext)

  const [onlineList, setOnlineList] = useState()
  const [arrivalMessage, setArrivalMessage] = useState(null)

  useEffect(() => {
    if (user) {

      // make connection to socket.io
      socket.current = io("http://localhost:3001")

      // add the user to online list
      socket.current.emit("addUser", user._id)

      socket.current.on("onlineUsersList", (onlineUsers) => {
        setOnlineList(onlineUsers)
      })

      socket.current.on("recieveMessage", (msgDetails) => {
        recieveMessage(msgDetails, setArrivalMessage)
      })

    }
  }, [user, arrivalMessage, currentChat, socket])

  //update online users list
  socket.current && socket.current.on("usersChange", (users) => {
    setOnlineList(users)
  })

  useEffect(() => {
    arrivalMessage && actionsWhenNewMessage(arrivalMessage, setArrivalMessage, setChats, setUnreadMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage])

  //this fucnction for sending private message
  const handleMessageSubmit = async ({ message, setMessage }) => {

    isAlreadyInContactList(contactsList, currentChat._id).then((newContact) => {
      if (newContact) {
        addToContactList(user._id, currentChat).then((newContactList) => {
          setContactsList(newContactList)
        })
      }
    })

    sendMessage(message, user._id, currentChat._id).then((messageObj) => {
      setChats(c => [...c, messageObj])
      setMessage('')
    })

  }

  //in the initial state StartAchat component will show, when user selecting a chat Chatbox component will show
  const chatSection = currentChat ? <ChatBox props={{ chats, handleMessageSubmit, onlineList }} />
    : <EmptyChat />

  return (
    <div className='MainChat-container' >
      {chatSection}
    </div>

  )
}

export default Chat