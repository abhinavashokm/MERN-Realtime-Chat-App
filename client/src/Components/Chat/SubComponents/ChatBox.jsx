import React, { useContext, useEffect, useState } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat';
import { unreadMessagesContext } from '../../../Store/UnreadMessages';
import styled from 'styled-components'
import "../Chat.css"

const Mess = styled.div`
display: flex;
margin: 5px 15px;
justify-content: ${props => props.isYours ? "flex-end" : "flex-start"} ;
`

function ChatBox({ props }) {

    const { handleMessageSubmit, onlineList, chats } = props

    //state for store input box data
    const [message, setMessage] = useState("")
    //online status of current chatting person
    const [onlineStatus, setOnlineStatus] = useState(false)

    const { currentChat } = useContext(currentChatContext)
    const { unreadMessages, setUnreadMessages } = useContext(unreadMessagesContext)

    //for setting current chatting persons online status
    useEffect(() => {
        if (currentChat && onlineList) {
            let status = onlineList.some(user => user.userId === currentChat._id)
            setOnlineStatus(status)
        }
    }, [currentChat, onlineList])

    const messageSubmitHelper = (e) => {
        e.preventDefault()
        handleMessageSubmit({ message, setMessage })
    }

    let filteredUnreadMessage = null

    //remove unread message when user read it
    useEffect(() => {
        if (filteredUnreadMessage) {
            setUnreadMessages(filteredUnreadMessage)
        }
    }, [filteredUnreadMessage, setUnreadMessages, currentChat])


    return (
        <div className='chat-container' >
            <div className="chat-header">
                {currentChat && <span className='person-name'>{currentChat.FullName}</span>}
                <span className={onlineStatus ? 'status-online' : 'status-offline'} >{onlineStatus ? "Online" : "last seen on "}
                   {onlineStatus ? "" : <span className='last-seen' >{currentChat.LastSeen}</span> }
                </span>
            </div>
            <div className="messages-container">
                {
                    //on filter we check
                    //is it recieved message by matching senderId and current chatting person's id 
                    //or check is it sended message by matching recieverId and current chating person's id 
                    currentChat && [...chats].reverse().filter(message => message.senderId === currentChat._id || message.recieverId === currentChat._id)
                        .map((obj, index) => {
                            if (unreadMessages.some(message => message.senderId === obj.senderId)) {
                                filteredUnreadMessage = unreadMessages.filter(message => message.senderId !== obj.senderId)
                            }
                            return (
                                <Mess key={index} isYours={obj.isYours}>
                                    <div className="message">
                                        <span>{obj.message}</span>
                                        <span className='sended-time' >{obj.time}</span>
                                    </div>
                                </Mess>
                            )
                        })
                }
            </div>
            <div className="chatBox">
                <div className="chatbox-container">
                    <form onSubmit={messageSubmitHelper} >
                        <input value={message} onChange={(e) => setMessage(e.target.value)}
                            className="chat-input" type="text" placeholder='type something...' />
                    </form>
                </div>
            </div>
        </div >
    )
}

export default ChatBox