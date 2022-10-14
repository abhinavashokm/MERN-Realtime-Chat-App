import React, { useState, useEffect, useRef, useContext } from 'react'
import "./Chat.css"
import styled from 'styled-components'
import { io } from 'socket.io-client';
import { userContext } from '../../Store/UserContext';
import { currentChatContext } from '../../Store/CurrentChat';
import axios from 'axios';

const Mess = styled.div`
display: flex;
margin: 5px 15px;
justify-content: ${props => props.isYours ? "flex-end" : "flex-start"} ;
`

function Chat() {
  //for getting text from input box
  const [message, setMessage] = useState("")
  //list of persons are currently online
  const [onlineList, setOnlineList] = useState({})
  //online status of current chat person
  const [onlineStatus, setOnlineStatus] = useState(false)
  //state for store arrivalMessage
  const [arrivalMessage, setArrivalMessage] = useState(null)
  //state for store sendingMessage
  const [sendingMessage, setSendingMessage] = useState(null)
  //store all chats made by user
  const [chats, setChats] = useState([])

  const { user } = useContext(userContext)
  const { currentChat } = useContext(currentChatContext)

  let socket = useRef(null)

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

  //get all chats made by user
  const getChats = () => {
    if (user) {
      axios.post("http://localhost:3001/getChat", { userId: user._id }).then((res) => {
        const data = res.data[0]
        console.log(data.chats)
        setChats(data.chats)
      })
    }
  }
  useEffect(() => {
    user && getChats(user)
  }, [user])



  // action on new arrivalmessage
  useEffect(() => {
    //add arrivalmessage to converstations list
    arrivalMessage && setChats(c => [...c, arrivalMessage])
    //update new messages to database
    arrivalMessage && axios.post("http://localhost:3001/updateChat", { userId: user._id, chats: arrivalMessage }).then((res) => {
      setArrivalMessage(null)
    })
  }, [arrivalMessage, user])

  //for setting current chatting persons online status
  useEffect(() => {
    if (currentChat) {
      let status = onlineList.some(user => user.userId === currentChat._id)
      setOnlineStatus(status)
    }
  }, [currentChat, onlineList])

  //this fucnction for sending private message
  const handleMessageSubmit = (e) => {
    e.preventDefault()
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
    setChats(c => [...c,messageObj])
    setSendingMessage(messageObj)
    setMessage('')
  }

  //for sending message upload to database
  useEffect(() => {
    //update new messages to database
    sendingMessage && axios.post("http://localhost:3001/updateChat", { userId: user._id, chats: sendingMessage }).then((res) => {
      setSendingMessage(null)
    })
  }, [sendingMessage, user])

  return (
    <div className='chat-container'>
      <div className="chat-header">
        {currentChat && <span>{currentChat.FullName}</span>}
        <span>{onlineStatus ? "Online" : "offline"}</span>
      </div>
      <div className="messages-container">
        {
          [...chats].reverse().map((obj, index) => {
            //when message receiving we check senderId and current chating person's id is it same or not
            //when message sending we check recieverId and current chating person's id is it same or not 
            if (currentChat) {
              if (obj.senderId === currentChat._id || obj.recieverId === currentChat._id) {
                return (
                  <Mess key={index} isYours={obj.isYours}>
                    <div className="message">
                      {obj.message}
                    </div>
                  </Mess>
                )
              } else {
                return (null)
              }
            }
          })
        }
      </div>
      <div className="chatBox">
        <div className="chatbox-container">
          <form onSubmit={handleMessageSubmit} >
            <input value={message} onChange={(e) => setMessage(e.target.value)}
              className="chat-input" type="text" placeholder='type something...' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat