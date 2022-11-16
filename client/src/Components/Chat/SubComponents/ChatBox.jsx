import React, { useContext, useEffect, useState } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat';
import { unreadMessagesContext } from '../../../Store/UnreadMessages';
import { chatHelper } from '../../../Helpers/ChatHelper';
import InputField from '../../InputField/InputField';
import Message from './Message';
import "../Chat.css"
import { filterUnreadMessages } from '../../../Helpers/HelperFunctions';

function ChatBox({ props }) {

    const { handleMessageSubmit, onlineList, chats } = props

    const [message, setMessage] = useState("")
    const [onlineStatus, setOnlineStatus] = useState(false)

    const { currentChat } = useContext(currentChatContext)
    const { unreadMessages, setUnreadMessages } = useContext(unreadMessagesContext)
    const { setOnlineStatusHelper } = useContext(chatHelper)

    //for setting current chatting persons online status
    useEffect(() => {
        currentChat && setOnlineStatusHelper(onlineList, setOnlineStatus)
    }, [currentChat, onlineList])

    //message sending helper
    const messageSubmitHelper = (e) => {
        e.preventDefault()
        handleMessageSubmit({ message, setMessage })
    }

    return (
        <div className='chat-container' >
            <div className="chat-header">

                {currentChat && <span className='person-name'>{currentChat.FullName}</span>}

                <span className={onlineStatus ? 'status-online' : 'status-offline'} >
                    {onlineStatus ? "Online" : "last seen on "}
                    {onlineStatus ? "" : <span className='last-seen' >{currentChat.LastSeen}</span>}
                </span>

            </div>
            <div className="messages-container">
                {
                    //on filter we check
                    //is it recieved message by matching senderId and current chatting person's id 
                    //or check is it sended message by matching recieverId and current chating person's id 
                    currentChat && [...chats].reverse().filter(message => message.senderId === currentChat._id || message.recieverId === currentChat._id)
                        .map((obj, index) => {

                            filterUnreadMessages(unreadMessages, obj.senderId, setUnreadMessages)
                            return (
                                <Message key={index} messageObj={obj} />
                            )
                        })
                }
            </div>
            <div className="chatBox">
                <div className="chatbox-container">
                    <form onSubmit={messageSubmitHelper} >
                        <InputField
                            type="text"
                            value={message}
                            name="message"
                            placeholder="type something..."
                            className="chat-input"
                            onChangeFunction={setMessage}
                        />
                    </form>
                </div>
            </div>
        </div >
    )
}

export default ChatBox