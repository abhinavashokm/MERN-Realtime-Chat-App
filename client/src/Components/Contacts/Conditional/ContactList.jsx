import React, { useContext } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { unreadMessagesContext } from '../../../Store/UnreadMessages'
import { chatsContext } from "../../../Store/ChatsContext"
import { contactListContext } from '../../../Store/ContactList'
import { checkSelectedChat, checkUnreadMessage, getLastMessage, compareFn } from '../../../Helpers/HelperFunctions'
import Contact from '../Items/Contact'

function ContactList() {

    const { contactsList } = useContext(contactListContext)
    const { currentChat } = useContext(currentChatContext)
    const { unreadMessages } = useContext(unreadMessagesContext)
    const { chats } = useContext(chatsContext)

    return (
        <div className='Contact-List' >
            {
                contactsList && contactsList.sort((a, b) => {
                    return compareFn(a, b, chats)
                })
                .map((contact, index) => {

                    const unreadMessagesCount = checkUnreadMessage(unreadMessages, contact._id)
                    const selectedChat = currentChat && checkSelectedChat(contact._id, currentChat._id)
                    const lastMessage = getLastMessage(contact._id, chats)

                    return (
                        <Contact props={{contact, unreadMessagesCount, selectedChat, lastMessage}} key={index} />
                    )
                })
            }
        </div>
    )
}

export default ContactList