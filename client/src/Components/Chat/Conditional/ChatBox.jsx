import React, { useContext, useEffect, useState } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat';
import { chatHelper } from '../../../Helpers/ChatHelper';
import ChatHeader from '../Items/Header';
import InputBox from '../Items/InputBox';
import Message from '../Items/Message';
import "../Chat.css"

function ChatBox({ props }) {

    const { handleMessageSubmit, onlineList, chats } = props

    const [message, setMessage] = useState("")
    const [onlineStatus, setOnlineStatus] = useState(false)
    const [blocked, setBlocked] = useState(false)

    const { currentChat } = useContext(currentChatContext)
    const { setOnlineStatusHelper, removeViewedUnreadMessages } = useContext(chatHelper)

    //for setting current chatting persons online status
    useEffect(() => {
        if (currentChat) {
            setOnlineStatusHelper(onlineList, setOnlineStatus)
            removeViewedUnreadMessages(currentChat._id)
        }
    }, [currentChat, onlineList])

    return (
        <div className='Chats-Container' >

            <ChatHeader props={{ onlineStatus, blocked, setBlocked }} />

            <div className="Messages-Container">
                {
                    currentChat && [...chats].reverse().filter(message => message.senderId === currentChat._id || message.recieverId === currentChat._id)
                        .map((obj, index) => {
                            return (
                                <Message key={index} messageObj={obj} />
                            )
                        })
                }
            </div>

            <InputBox props={{ handleMessageSubmit, message, setMessage, setBlocked, blocked, onlineStatus }} />

        </div >
    )
}

export default ChatBox