import React, { useContext } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { unreadMessagesContext } from '../../../Store/UnreadMessages'
import { chatsContext } from "../../../Store/ChatsContext"
import { findOneUser } from '../../../Helpers/HelperFunctions'
import { checkSelectedChat, checkUnreadMessage, setLastMessage } from '../../../Helpers/HelperFunctions'

function ContactList({ props }) {

    const { contactsList } = props
    const { setCurrentChat, currentChat } = useContext(currentChatContext)
    const { unreadMessages } = useContext(unreadMessagesContext)
    const { chats } = useContext(chatsContext)

    return (
        <div>
            {
                contactsList && contactsList.map((contact, index) => {

                    const unreadMessagesCount = checkUnreadMessage(unreadMessages, contact._id)
                    const selectedChat = currentChat && checkSelectedChat(contact._id, currentChat._id)
                    const lastMessage = setLastMessage(contact._id, chats)

                    return (
                        <div
                            onClick={() => {
                                findOneUser(contact._id).then((userDetails) => {
                                    setCurrentChat(userDetails)
                                })
                            }}
                            key={index}
                            className={selectedChat ? "selected-contact-item" : "contact-item"}
                        >
                            <img className='avatarImg' src="data:image/png;base64,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" alt="person" />

                            <div className='contactItemLeft' >
                                <span className='contactName'>{contact.FullName}</span>
                                {lastMessage && <span className='lastMsg' >{lastMessage.isYours ? <span>You: </span> : ""} {lastMessage.message}</span>}
                            </div>

                            <div className='contactItemRight' >
                            { lastMessage && <span className='lastMsgTime' >{lastMessage.time}</span>}
                            {
                                unreadMessagesCount &&
                                <div className='unreadMessages-badge' >
                                    <span>{unreadMessagesCount}</span>
                                </div>
                            }
                            </div>

                        </div>
                    )
                })
            }
        </div>
    )
}

export default ContactList