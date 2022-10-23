import React, { useState, useEffect, useContext } from 'react'
import "./Chat.css"
import { io } from 'socket.io-client';
import { userContext } from '../../Store/UserContext';
import { currentChatContext } from '../../Store/CurrentChat';
import { unreadMessagesContext } from '../../Store/UnreadMessages';
import ChatBox from './SubComponents/ChatBox';
import StartAChat from './SubComponents/StartAChat';

function Chat() {

  const { user, socket } = useContext(userContext)
  const { currentChat } = useContext(currentChatContext)
  const { setUnreadMessages } = useContext(unreadMessagesContext)

  //list of users currently online
  const [onlineList, setOnlineList] = useState()
  //state for store latest arrival message
  const [arrivalMessage, setArrivalMessage] = useState(null)
  //state for store live chat
  const [chats, setChats] = useState([])

  useEffect(() => {
    if (user) {
      // make connection to socket.io
      socket.current = io("http://localhost:3001")
      // add the user to online list
      socket.current.emit("addUser", user._id)
      // fetching currently online users list
      socket.current.on("onlineUsersList", (onlineUsers) => {
        setOnlineList(onlineUsers)
      })
      // recieve message
      socket.current.on("recieveMessage", (data) => {
        setArrivalMessage({
          message: data.msg,
          senderId: data.senderId,
          recieverId: data.recieverId,
          isYours: false
        })
      })
    }
  }, [user, arrivalMessage, currentChat])

  //update online users list
  socket.current && socket.current.on("usersChange", (users) => {
    setOnlineList(users)
  })

  // action on new arrivalmessage
  useEffect(() => {
    //add arrivalmessage to converstations list
    if(arrivalMessage) {
    setChats(c => [...c, arrivalMessage]) 
    setUnreadMessages(d => [...d, arrivalMessage])
    setArrivalMessage(null)
    }
  }, [arrivalMessage, user])


  //this fucnction for sending private message
  const handleMessageSubmit = ({message, setMessage}) => {
    if (!currentChat) {
      return false
    }
    socket.current.emit("sendMessage", {
      senderId: user._id,
      recieverId: currentChat._id,
      msg: message
    })
    const messageObj = {
      message: message,
      senderId: user._id,
      isYours: true,
      recieverId: currentChat._id
    }
    setChats(c => [...c, messageObj])
    setMessage('')
  }

  //in the initial state StartAchat component will show, when user selecting a chat Chatbox component will show
  const chatSection = currentChat ? <ChatBox props={{ chats, handleMessageSubmit, onlineList}} />
    : <StartAChat />

  return (
    <div className='MainChat-container' >
      {chatSection}
    </div>

  )
}

export default Chat