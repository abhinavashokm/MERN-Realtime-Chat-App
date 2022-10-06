import React, { useState, useEffect, useRef, useContext } from 'react'
import "./Chat.css"
import styled from 'styled-components'
import { io } from 'socket.io-client';
import { userContext } from '../../Store/UserContext';
import { currentChatContext } from '../../Store/CurrentChat';

const Mess = styled.div`
display: flex;
margin: 5px 15px;
justify-content: ${props => props.isYours ? "flex-end" : "flex-start"} ;
`

function Chat() {
  const [message, setMessage] = useState("")
  const [onlineList, setOnlineList] = useState({})
  const [onlineStatus, setOnlineStatus] = useState(false)
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [conversations, setConversations] = useState([])

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
          isYours : false
        })
      })
    }
  }, [user, arrivalMessage, currentChat])

  //// action on new arrivalmessage
  useEffect(() => {
    arrivalMessage && setConversations(c => [...c, arrivalMessage])
  }, [arrivalMessage])

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
    setConversations(c => [...c,
    {
      message: message,
      senderId: user._id,
      isYours : true
    }
    ])
    setMessage('')
  }

  return (
    <div className='chat-container'>
      <div className="chat-header">
        {currentChat && <span>{currentChat.FullName}</span>}
        <span>{onlineStatus ? "Online" : "offline"}</span>
      </div>
      <div className="messages-container">
        {
          [...conversations].reverse().map((obj, index) => {
            return (
              <Mess key={index} isYours={obj.isYours}>
                <div className="message">
                  {obj.message}
                </div>
              </Mess>
            )
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