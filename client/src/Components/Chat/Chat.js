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

  //state for store input box data
  const [message, setMessage] = useState("")
  //list of users currently online
  const [onlineList, setOnlineList] = useState({})
  //online status of current chatting person
  const [onlineStatus, setOnlineStatus] = useState(false)
  //state for store latest arrival message
  const [arrivalMessage, setArrivalMessage] = useState(null)
  //state for store live chat
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

  // action on new arrivalmessage
  useEffect(() => {
    //add arrivalmessage to converstations list
    arrivalMessage && setChats(c => [...c, arrivalMessage])
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
    setChats(c => [...c, messageObj])
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
          //on filter we check
          //is it recieved message by matching senderId and current chatting person's id 
          //or check is it sended message by matching recieverId and current chating person's id 
          currentChat && [...chats].reverse().filter(message => message.senderId === currentChat._id || message.recieverId === currentChat._id)
            .map((obj, index) => {
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