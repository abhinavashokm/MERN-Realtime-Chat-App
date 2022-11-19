import React, { useContext, useEffect, useState } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat';
import { unreadMessagesContext } from '../../../Store/UnreadMessages';
import { chatHelper } from '../../../Helpers/ChatHelper';
import { filterUnreadMessages } from '../../../Helpers/HelperFunctions';
import ChatHeader from '../Items/Header';
import ChatInput from '../Items/ChatInput';
import Message from '../Items/Message';
import "../Chat.css"

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

    return (
        <div className='chat-container' >

            <ChatHeader props={{ onlineStatus }} />

            <div className="messages-container">
                {
                    currentChat && [...chats].reverse().filter(message => message.senderId === currentChat._id || message.recieverId === currentChat._id)
                        .map((obj, index) => {

                            filterUnreadMessages(unreadMessages, obj.senderId, setUnreadMessages)
                            
                            return (
                                <Message key={index} messageObj={obj} />
                            )
                        })
                }
            </div>

            <ChatInput props={{ handleMessageSubmit, message, setMessage }} />

        </div >
    )
}

export default ChatBox